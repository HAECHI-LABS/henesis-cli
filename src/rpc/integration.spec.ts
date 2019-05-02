import { expect } from '@oclif/test';
import { IntegrationRpc } from './integration';
import { ChainType, Handler, Integration, Subscriber, Webhook } from '../types';
import * as faker from 'faker';

const mockServer = require('mockttp').getLocal();

describe('IntegrationRpc', () => {
  let integrationRpc: IntegrationRpc;
  // Start your server
  beforeEach(async () => {
    integrationRpc = new IntegrationRpc('http://localhost:8080');
    await mockServer.start(8080);
  });
  
  afterEach(async () => {
    await mockServer.stop();
  });
  
  it('should get integration list', async () => {
    const integrations = [mockIntegrationFactory(), mockIntegrationFactory()];
    await mockServer.get('/integrations/v1').thenJSON(200, integrations);
    const response: Integration[] = await integrationRpc.getIntegrationList();
    expect(response).to.deep.equal(integrations);
  });
  
  it('should get a integration', async () => {
    const integration = mockIntegrationFactory();
    await mockServer.get('/integrations/v1/' + integration.integrationId).thenJSON(200, integration);
    const response: Integration | null = await integrationRpc.getIntegration(integration.integrationId);
    expect(response).to.deep.equal(integration);
  });
  
  it('should patch a integration', async () => {
    const integration = mockIntegrationFactory();
    integration.version = 'v3';
    
    await mockServer.patch('/integrations/v1/' + integration.integrationId).thenJSON(200, integration);
    const response: Integration | null = await integrationRpc.patchIntegration(integration.integrationId, { version: 'v3' } as Integration);
    expect(response).to.deep.equal(integration);
  });
  
  it('should create a integration', async () => {
    const integration = mockIntegrationFactory();
    await mockServer.post('/integrations/v1').thenJSON(200, integration);
    const response: Integration | null = await integrationRpc.createIntegration(integration);
    expect(response).to.deep.equal(integration);
  });
  
  it('should delete a integration', async () => {
    const integration = mockIntegrationFactory();
    await mockServer.delete('/integrations/v1/' + integration.integrationId).thenReply(200, null);
    const response: null = await integrationRpc.deleteIntegration(integration.integrationId);
    expect(response).to.deep.equal(null);
  });
});

export function mockIntegrationFactory(): Integration {
  return new Integration(
    faker.random.alphaNumeric(),
    faker.random.number(),
    faker.name.firstName(),
    'v1',
    new Subscriber(
      "localhost:8080",
      "0x12u31ijdiasdjmi",
      "abi",
      ChainType.ETHEREUM,
    ),
    [new Handler(
      faker.random.alphaNumeric(),
      faker.name.firstName(),
      "event",
      "v1",
      faker.random.words(5),
      "tsnode8",
      "handler"
    )],
    new Webhook(
      faker.internet.ip(),
      "POST",
      {"Authorization": "Bear ashd8uado9012i31kod"},
    ),
    'Starting'
  )
}
