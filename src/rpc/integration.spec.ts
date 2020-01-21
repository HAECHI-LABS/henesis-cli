import { expect } from '@oclif/test';
import { IntegrationRpc } from './integration';
import wretch from 'wretch';
import { baseUrl, rpcVersion } from './config';
import { newMockIntegration, newMockIntegrationSpec } from '../mock';
import * as mockhttp from 'mockttp';
import {
  Blockchain,
  CreateIntegrationRequest,
  Integration,
  UpdateIntegrationRequest,
} from '../types';

wretch().polyfills({
  fetch: require('node-fetch'),
  FormData: require('form-data'),
  URLSearchParams: require('url').URLSearchParams,
});

process.env.HENESIS_TEST = 'true';
describe('IntegrationRpc', () => {
  let integrationRpc: IntegrationRpc;
  const mockServer = mockhttp.getLocal();
  // Start your servers
  beforeEach(async () => {
    const url = baseUrl();
    integrationRpc = new IntegrationRpc(url, rpcVersion);
    await mockServer.start(8080);
  });

  afterEach(async () => {
    await mockServer.stop();
  });

  describe('#getIntegrations()', async () => {
    it('should get integration list', async () => {
      const integrations = [newMockIntegration(), newMockIntegration()];
      await mockServer.get('/integrations/v1').thenJson(200, integrations);
      const response: Integration[] = await integrationRpc.getIntegrations();
      expect(JSON.stringify(response)).to.deep.equal(
        JSON.stringify(integrations),
      );
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
      expect(JSON.stringify(response)).to.deep.equal(
        JSON.stringify(integration),
      );
    });
  });

  describe('#getIntegrationByName()', async () => {
    it('should get a integration by name', async () => {
      const integration = newMockIntegration();
      await mockServer
        .get('/integrations/v1/findByName')
        .withQuery({ name: integration.name })
        .thenJSON(200, integration);

      const response: Integration | null = await integrationRpc.getIntegrationByName(
        integration.name,
      );
      expect(JSON.stringify(response)).to.deep.equal(
        JSON.stringify(integration),
      );
    });
  });

  describe('#updateIntegration()', async () => {
    it('should update a integration', async () => {
      const integration = newMockIntegration();
      integration.version = 'v3';
      await mockServer
        .put('/integrations/v1/' + integration.integrationId)
        .thenJSON(200, integration);
      const response: Integration | null = await integrationRpc.updateIntegration(
        integration.integrationId,
        ({
          version: 'v3',
        } as any) as UpdateIntegrationRequest,
      );
      expect(JSON.stringify(response)).to.deep.equal(
        JSON.stringify(integration),
      );
    });
  });

  describe('#createIntegration()', async () => {
    it('should create a integration', async () => {
      const integration = newMockIntegration();
      const integrationSpec = new Map<string, Object>([
        ['spec', newMockIntegrationSpec()]
      ]);
      await mockServer.post('/integrations/v1').thenJSON(200, integration);
      const response: Integration | null = await integrationRpc.createIntegration(
        new CreateIntegrationRequest(
          integration.name,
          integration.version,
          integration.apiVersion,
          new Blockchain(
            integration.blockchain.platform,
            integration.blockchain.network,
            integration.blockchain.threshold,
          ),
          integration.filter,
          integration.provider,
          integrationSpec,
        ),
      );
      expect(JSON.stringify(response)).to.deep.equal(
        JSON.stringify(integration),
      );
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
