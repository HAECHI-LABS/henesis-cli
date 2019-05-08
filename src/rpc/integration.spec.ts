import { expect } from '@oclif/test';
import { IntegrationRpc } from './integration';
import wretch from 'wretch';
import { baseUrl, rpcVersion } from './config';
import { newMockIntegration } from '../mock';
import * as mockhttp from 'mockttp';
import { Integration } from '../types';

wretch().polyfills({
  fetch: require('node-fetch'),
  FormData: require('form-data'),
  URLSearchParams: require('url').URLSearchParams,
});

describe('IntegrationRpc', () => {
  let integrationRpc: IntegrationRpc;
  const mockServer = mockhttp.getLocal();
  // Start your servers
  beforeEach(async () => {
    integrationRpc = new IntegrationRpc(baseUrl, rpcVersion);
    await mockServer.start(8080);
  });

  afterEach(async () => {
    await mockServer.stop();
  });

  describe('#getIntegrations()', async () => {
    it('should get integration list', async () => {
      const integrations = [newMockIntegration(), newMockIntegration()];
      await mockServer.get('/integrations/v1').thenJSON(200, integrations);
      const response: Integration[] = await integrationRpc.getIntegrations();
      expect(response).to.deep.equal(integrations);
    });

    it('should throw invalid response format error', async () => {
      const invalidJson = { invalid: 'error' };
      await mockServer.get('/integrations/v1').thenJSON(200, invalidJson);
      try {
        await integrationRpc.getIntegrations();
      } catch (err) {
        expect(err.toString()).to.equal(
          'Error: Expected getIntegrationsList to return an array but it returned [object Object]',
        );
      }
    });

    it('should throw 400 httpError', async () => {
      const res = 'page not found';
      await mockServer.get('/integrations/v1').thenReply(400, res);
      try {
        await integrationRpc.getIntegrations();
      } catch (err) {
        expect(err.toString()).to.deep.equal('Error: page not found');
      }
    });
  });

  describe('#getIntegration()', async () => {
    it('should get a integration', async () => {
      const integration = newMockIntegration();
      await mockServer
        .get('/integrations/v1/' + integration.integrationId)
        .thenJSON(200, integration);
      const response: Integration | null = await integrationRpc.getIntegration(
        integration.integrationId,
      );
      expect(response).to.deep.equal(integration);
    });
  });

  describe('#patchIntegration()', async () => {
    it('should patch a integration', async () => {
      const integration = newMockIntegration();
      integration.version = 'v3';
      await mockServer
        .patch('/integrations/v1/' + integration.integrationId)
        .thenJSON(200, integration);
      const response: Integration | null = await integrationRpc.patchIntegration(
        integration.integrationId,
        {
          version: 'v3',
        } as Integration,
      );
      expect(response).to.deep.equal(integration);
    });
  });

  describe('#createIntegration()', async () => {
    it('should create a integration', async () => {
      const integration = newMockIntegration();
      await mockServer.post('/integrations/v1').thenJSON(200, integration);
      const response: Integration | null = await integrationRpc.createIntegration(
        integration,
      );
      expect(response).to.deep.equal(integration);
    });
  });

  describe('#deleteIntegration()', async () => {
    it('should delete a integration', async () => {
      const integration = newMockIntegration();
      await mockServer
        .delete('/integrations/v1/' + integration.integrationId)
        .thenReply(200, undefined);
      const response = await integrationRpc.deleteIntegration(
        integration.integrationId,
      );
      expect(response).to.deep.equal(null);
    });
  });
});
