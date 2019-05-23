import { expect, test } from '@oclif/test';
import { newMockIntegration } from '../../mock';
import { Scope } from 'nock';

describe('integration:status', (): void => {
  context(
    'When no error occurred',
    (): void => {
      const res = [newMockIntegration(), newMockIntegration()];
      test
        .nock(
          'http://localhost:8080',
          (api): Scope => api.get('/integrations/v1').reply(200, res),
        )
        .stdout()
        .command(['integration:status'])
        .it(
          'shows integration lists',
          (ctx): void => {
            expect(ctx.stdout).to.equal(
              `Id              Name      Platform  Network   Version   Status    \n${
                res[0].integrationId
              } asdf      ethereum  mainnet   v1        Starting  \n${
                res[1].integrationId
              } asdf      ethereum  mainnet   v1        Starting  \n`,
            );
          },
        );
    },
  );

  context('When error occurred', () => {
    test
      .nock('http://localhost:8080', api =>
        api.get('/integrations/v1').reply(400, 'error occurred'),
      )
      .stdout()
      .command(['integration:status'])
      .exit(1)
      .it('exit with status 1 when fail to getIntegrations');
  });
});
