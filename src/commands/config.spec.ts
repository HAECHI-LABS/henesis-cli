import { expect, test } from '@oclif/test';
import configstore from '../common/configstore';

describe('config', (): void => {
  before(
    (): void => {
      process.env.HENESIS_TEST = 'false';
    },
  );

  test
    .stdout()
    .command(['config'])
    .exit(2)
    .it('should fail do not specify an option');

  test
    .stdout()
    .command(['config', '-e', 'http://asdf'])
    .exit(2)
    .it('should be fail not https');

  test
    .stdout()
    .command(['config', '-e', 'https://asdf'])
    .it(
      'should be success',
      (ctx): void => {
        expect(ctx.stdout).to.equal('Successfully set to https://asdf\n');
        expect(configstore.get('endpoint')).to.equal('https://asdf');
      },
    );

  after(
    (): void => {
      process.env.HENESIS_TEST = 'true';
      configstore.delete('endpoint');
    },
  );
});
