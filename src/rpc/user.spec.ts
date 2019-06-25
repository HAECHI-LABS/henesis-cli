import { expect } from '@oclif/test';
import wretch from 'wretch';
import { baseUrl } from './config';
import * as mockhttp from 'mockttp';
import { UserRpc } from './user';
import { LoginResponse } from '../types';
import { newMockLogin } from '../mock';

wretch().polyfills({
  fetch: require('node-fetch'),
  FormData: require('form-data'),
  URLSearchParams: require('url').URLSearchParams,
});

describe('UserRpc', (): void => {
  const mockServer = mockhttp.getLocal();
  let userRpc: UserRpc;

  beforeEach(
    async (): Promise<void> => {
      const url = baseUrl();
      userRpc = new UserRpc(url);
      await mockServer.start(8080);
    },
  );

  afterEach(
    async (): Promise<void> => {
      await mockServer.stop();
    },
  );

  describe('#login()', (): void => {
    it('should be failed when Nonexistent User Info.', async (): Promise<
      void
    > => {
      await mockServer.post('/users/login').thenReply(401);

      try {
        await userRpc.login('asdf', 'password');
      } catch (err) {
        expect(err.toString()).to.equal('Error: Unauthenticated User');
      }
    });

    it('success Login Process.', async (): Promise<void> => {
      const loginData = newMockLogin();
      await mockServer.post('/users/login').thenJSON(200, loginData);
      const response: LoginResponse = await userRpc.login(
        loginData.email,
        'password',
      );
      expect(response).to.deep.equal(loginData);
    });
  });

  describe('#changePassword()', (): void => {
    it('should be failed when different exist password.', async (): Promise<
      void
    > => {
      await mockServer.patch('/users/passwd').thenReply(403);

      try {
        await userRpc.changePassword(
          'existing password',
          'To be changed password',
        );
      } catch (err) {
        expect(err.toString()).to.equal('Error: No satisfied conditions');
      }
    });

    it('should be failed when jwt Token is expire.', async (): Promise<
      void
    > => {
      await mockServer.patch('/users/passwd').thenReply(401);

      try {
        await userRpc.changePassword(
          'existing password',
          'To be changed password',
        );
      } catch (err) {
        expect(err.toString()).to.equal('Error: Unauthenticated Token');
      }
    });
  });
});
