import { expect, test } from '@oclif/test';
import configstore from '../common/configstore';

describe('config', (): void => {
  before((): void => {
    process.env.HENESIS_TEST = 'false';
  });

  test
    .stdout()
    .command(['config'])
    .it('should fail do not specify an option');

  test
    .stdout()
    .command(['config', '-e', 'http://asdf'])
    .it('should be success to change http url', (ctx): void => {
      expect(ctx.stdout).to.equal('Successfully set to http://asdf\n');
      expect(configstore.get('endpoint')).to.equal('http://asdf');
    });

  test
    .stdout()
    .command(['config', '-e', 'https://asdf'])
    .it('should be success to change https url', (ctx): void => {
      expect(ctx.stdout).to.equal('Successfully set to https://asdf\n');
      expect(configstore.get('endpoint')).to.equal('https://asdf');
    });

  after((): void => {
    process.env.HENESIS_TEST = 'true';
    configstore.delete('endpoint');
  });
});
