import { expect, test } from '@oclif/test';
import * as utils from '../utils';
import configstore from '../common/configstore';
import { Scope } from 'nock';

describe('login', (): void => {
  test
    .nock(
      'http://localhost:8080',
      (api): Scope =>
        api.post('/users/login').reply(200, {
          email: 'yoonsung@haechi.io',
          name: 'ys.choi',
          organization: 'haechilabs',
          jwtToken: 'asdf',
          id: 43,
        }),
    )
    .stub(
      utils,
      'confirmPrompt',
      async (): Promise<boolean> => {
        return Promise.resolve(true);
      },
    )
    .stub(
      utils,
      'emailPrompt',
      async (): Promise<string> => {
        return Promise.resolve('yoonsung@haechi.io');
      },
    )
    .stub(
      utils,
      'passwordPrompt',
      async (): Promise<string> => {
        return Promise.resolve('Ethereum');
      },
    )
    .stdout()
    .command(['login'])
    .it(
      'should be success login with message',
      (ctx): void => {
        expect(ctx.stdout).to.equal(
          'Allow Henesis to collect anonymous CLI usage and error reporting information\n🎉 Login Success from yoonsung@haechi.io 🎉\n',
        );
      },
    );

  test
    .stub(
      utils,
      'confirmPrompt',
      async (): Promise<boolean> => {
        return Promise.resolve(true);
      },
    )
    .stub(
      utils,
      'emailPrompt',
      async (): Promise<string> => {
        return Promise.resolve('yoonsung@haechi.io');
      },
    )
    .stub(
      utils,
      'passwordPrompt',
      async (): Promise<string> => {
        return Promise.resolve('Ethereum');
      },
    )
    .stdout()
    .command(['login'])
    .it(
      'should be already login with message',
      (ctx): void => {
        expect(ctx.stdout).to.equal(
          'You are already logged in as yoonsung@haechi.io\n',
        );
      },
    );

  after(
    (): void => {
      configstore.delete('user');
      configstore.delete('analytics');
    },
  );
});
