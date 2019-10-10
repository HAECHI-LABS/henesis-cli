import { expect, test } from '@oclif/test';
import { Scope } from 'nock';

process.env.HENESIS_TEST = 'true';
describe('integration:delete', (): void => {
  context('when no error occurred', (): void => {
    const id = 'integrationId';
    test
      .nock(
        'http://localhost:8080',
        (api): Scope => api.delete('/integrations/v1/' + id).reply(200, ''),
      )
      .stdout()
      .command([`integration:delete`, id])
      .it('delete a integration', (ctx): void => {
        expect(ctx.stdout).to.equal(`${id} has been deleted\n`);
      });
  });

  context('when integrationId does not exist', (): void => {
    test
      .stdout()
      .command(['integration:delete'])
      .it('exits with status 1 when integrationId does not provided');
  });
});
