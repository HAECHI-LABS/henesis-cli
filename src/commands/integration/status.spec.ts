import { test } from '@oclif/test';

process.env.HENESIS_TEST = 'true';
describe('integration:status', (): void => {
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
