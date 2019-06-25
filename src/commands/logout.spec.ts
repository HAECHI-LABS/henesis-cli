import { expect, test } from '@oclif/test';
import configstore from '../common/configstore';

describe('logout', (): void => {
  test
    .stdout()
    .command('logout')
    .it(
      'should be successfully logout with message',
      (ctx): void => {
        expect(ctx.stdout).to.equal(`🤗 Logout Success 👍\n`);
        expect(configstore.get('user')).to.equal(undefined);
        expect(configstore.get('analytics')).to.equal(undefined);
      },
    );
});
