import { expect, test } from '@oclif/test';

process.env.HENESIS_TEST = "true";
describe('integration:delete', () => {
  context('when no error occurred', () => {
    const id = 'integrationId';
    test
      .nock('http://localhost:8080', api =>
        api.delete('/integrations/v1/' + id).reply(200, ''),
      )
      .stdout()
      .command([`integration:delete`, id])
      .it('delete a  integration', ctx => {
        expect(ctx.stdout).to.equal(`${id} has been deleted\n`);
      });
  });

  context('when integrationId does not exist', () => {
    test
      .stdout()
      .command(['integration:delete'])
      .exit(1)
      .it('exits with status 1 when integrationId does not provided');
  });
});
