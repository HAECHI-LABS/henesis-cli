import { test } from '@oclif/test';
import { Scope } from 'nock';

process.env.HENESIS_TEST = 'true';
describe('integration:status', (): void => {
  context('When error occurred', (): void => {
    test
      .nock(
        'http://localhost:8080',
        (api): Scope =>
          api.get('/integrations/v1').reply(400, 'error occurred'),
      )
      .stdout()
      .command(['integration:status'])
      .it('exit with status 2 when fail to getIntegrations');
  });
});
