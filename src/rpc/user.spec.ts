import { expect } from '@oclif/test';
import wretch from 'wretch';
import { baseUrl, rpcVersion } from './url';
import * as mockhttp from 'mockttp';
import { UserRpc } from './user';
import { DescribeResponse, LoginResponse } from '../types';
import { newMockLogin, newMockAccount } from '../mock';

wretch().polyfills({
  fetch: require('node-fetch'),
  FormData: require('form-data'),
  URLSearchParams: require('url').URLSearchParams,
});

process.env.HENESIS_TEST = 'true';
describe('UserRpc', (): void => {
  const mockServer = mockhttp.getLocal();
  let userRpc: UserRpc;

  beforeEach(
    async (): Promise<void> => {
      const url = baseUrl();
      userRpc = new UserRpc(url, rpcVersion);
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
      await mockServer
        .post('/users/v1/login')
        .thenJson(403, { error: { message: 'login failed' } });

      try {
        await userRpc.login('asdf', 'password');
      } catch (err) {
        expect(err.toString()).to.equal('Error: login failed');
      }
    });

    it('success Login Process.', async (): Promise<void> => {
      const loginData = newMockLogin();
      await mockServer.post('/users/v1/login').thenJSON(200, loginData);
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
      await mockServer.patch('/users/v1/passwd').thenJson(403, {});

      try {
        await userRpc.changePassword(
          'existing password',
          'To be changed password',
        );
      } catch (err) {
        expect(err.toString()).to.equal('Error: failed to change password');
      }
    });

    it('should be failed when jwt Token is expire.', async (): Promise<
      void
    > => {
      await mockServer.patch('/users/v1/passwd').thenJson(401, {
        error: { message: 'expired token (please log in again)' },
      });

      try {
        await userRpc.changePassword(
          'existing password',
          'To be changed password',
        );
      } catch (err) {
        expect(err.toString()).to.equal(
          'Error: expired token (please log in again)',
        );
      }
    });
  });

  describe('#describeAccount()', (): void => {
    it('should be failed when jwt Token is expire.', async (): Promise<
      void
    > => {
      await mockServer.get('/users/v1/me').thenJson(401, {
        error: { message: 'expired token (please log in again)' },
      });

      try {
        await userRpc.describe();
      } catch (err) {
        expect(err.toString()).to.equal(
          'Error: expired token (please log in again)',
        );
      }
    });

    it('success describe account.', async (): Promise<void> => {
      const accountData = newMockAccount();
      await mockServer.get('/users/v1/me').thenJson(200, accountData);
      const response: DescribeResponse = await userRpc.describe();
      expect(response).to.deep.equal(accountData);
    });
  });
});
