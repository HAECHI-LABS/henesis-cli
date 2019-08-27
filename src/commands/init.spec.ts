import { expect, test } from '@oclif/test';
import * as rimraf from 'rimraf';
import { join } from 'path';

describe('init', (): void => {
  afterEach((): void => {
    const path = join(__dirname, '..', '..', `/henesis`);
    rimraf(path, (): void => {});
  });

  test
    .stdout()
    .command(['init'])
    .it('must be able to successfully create folders.', (ctx): void => {
      expect(ctx.stdout).to.equal('henesis directory has been created.\n');
    });

  test
    .stdout()
    .command(['init', '-n', 'sample'])
    .it(
      'must be able to successfully create folders with name.',
      (ctx): void => {
        const path = join(__dirname, '..', '..', `/sample`);
        rimraf(path, (): void => {});
        expect(ctx.stdout).to.equal('sample directory has been created.\n');
      },
    );

  test
    .stdout()
    .command(['init', '-g', 'https://github.com/HAECHI-LABS/henesis-dai.git'])
    .it(
      'should be able to successfully create folders with git template',
      (ctx): void => {
        const path = join(__dirname, '..', '..', `/henesis-dai`);
        rimraf(path, (): void => {});
        expect(ctx.stdout).to.equal(
          'henesis-dai directory has been created.\n',
        );
      },
    );

  test
    .stdout()
    .command(['init'])
    .command(['init', '-f'])
    .it(
      'should be able to successfully create folder with force',
      (ctx): void => {
        expect(ctx.stdout).to.equal(
          'henesis directory has been created.\nhenesis directory has been created.\n',
        );
      },
    );

  test
    .stdout()
    .command(['init'])
    .command(['init'])
    .exit(2)
    .it('must be fail when directory already exists.');
});
