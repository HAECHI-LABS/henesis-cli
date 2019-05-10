import { expect, test } from '@oclif/test';
import { newMockIntegration } from '../../mock';
import { buildMsg } from './status';

describe('integration:status', () => {
  context('When no error occurred', () => {
    const res = [newMockIntegration(), newMockIntegration()];
    test
      .nock('http://localhost:8080', api =>
        api.get('/integrations/v1').reply(200, res),
      )
      .stdout()
      .command(['integration:status'])
      .it('shows integration lists', ctx => {
        const expected =
          buildMsg('ID', 'Name', 'Network', 'Version', 'Status') +
          buildMsg(
            res[0].integrationId,
            res[0].name,
            res[0].subscriber.type,
            res[0].version,
            res[0].status,
          ) +
          buildMsg(
            res[1].integrationId,
            res[1].name,
            res[1].subscriber.type,
            res[1].version,
            res[1].status,
          ) +
          '\n';
        expect(ctx.stdout).to.equal(expected.substring(0, expected.length-1));
      });
  });

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
