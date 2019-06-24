import { test } from '@oclif/test';
import { Scope } from 'nock';

process.env.HENESIS_TEST = 'true';
describe('integration:status', (): void => {
  context(
    'When error occurred',
    (): void => {
      test
        .nock(
          'http://localhost:8080',
          (api): Scope =>
            api.get('/integrations/v1').reply(400, 'error occurred'),
        )
        .stdout()
        .command(['integration:status'])
        .exit(2)
        .it('exit with status 1 when fail to getIntegrations');
    },
  );
});
