import { expect, test } from '@oclif/test';
import { newMockIntegration } from '../../mock';
import { Scope } from 'nock';

process.env.HENESIS_TEST = 'true';
describe('integration:describe', (): void => {
  context('when no error occurred', (): void => {
    const integration = newMockIntegration();
    test
      .nock(
        'http://localhost:8080',
        (api): Scope =>
          api
            .get('/integrations/v1/' + integration.integrationId)
            .reply(200, integration),
      )
      .stdout()
      .command([`integration:describe`, integration.integrationId])
      .it('describe a integration', (ctx): void => {
        expect(ctx.stdout).to.equal(
          JSON.stringify(integration, undefined, 2) + '\n',
        );
      });
  });

  context('when integrationId does not provided', (): void => {
    test
      .stdout()
      .command(['integration:describe'])
      .it('exits with status 1 when integrationId does not provided');
  });
});
