import { expect, test } from '@oclif/test';
import * as utils from '../../utils';
import configstore from '../../common/configstore';
import { Scope } from 'nock';

describe('account:changepw', (): void => {
  context(
    'error occurred cases',
    async (): Promise<void> => {
      test
        .stdout()
        .command(['account:changepw'])
        .exit(2)
        .it('should be fail not logged in');
    },
  );

  context(
    'deploy spec when no error occurred',
    async (): Promise<void> => {
      before((): void => {
        configstore.set('user', {
          email: 'yoonsung@haechi.io',
          name: 'ys.choi',
          organization: 'haechilabs',
          jwtToken: 'asdf',
          id: 43,
        });
      });

      test
        .nock(
          'http://localhost:8080',
          (api): Scope => api.patch('/users/v1/passwd').reply(200, {}),
        )
        .stub(
          utils,
          'passwordPrompt',
          async (): Promise<string> => {
            return Promise.resolve('12345678');
          },
        )
        .stdout()
        .command(['account:changepw'])
        .it('should be success Password change', (ctx): void => {
          expect(ctx.stdout).to.equal('🦄 Password changed!\n');
        });
    },
  );

  after((): void => {
    configstore.delete('user');
    configstore.delete('analytics');
  });
});
