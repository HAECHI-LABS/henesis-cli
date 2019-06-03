import { expect, test } from '@oclif/test';
import { newMockIntegration } from '../../mock';

process.env.HENESIS_TEST = "true";
describe('integration:describe', () => {
  context('when no error occurred', () => {
    const integration = newMockIntegration();
    test
      .nock('http://localhost:8080', api =>
        api
          .get('/integrations/v1/' + integration.integrationId)
          .reply(200, integration),
      )
      .stdout()
      .command([`integration:describe`, integration.integrationId])
      .it('describe a integration', ctx => {
        expect(ctx.stdout).to.equal(
          JSON.stringify(integration, undefined, 2) + '\n',
        );
      });
  });

  context('when integrationId does not provided', () => {
    test
      .stdout()
      .command(['integration:describe'])
      .exit(1)
      .it('exits with status 1 when integrationId does not provided');
  });
});
