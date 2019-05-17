import {
  ChainType,
  Handler,
  HandlerSpec,
  Integration,
  IntegrationSpec,
  Subscriber,
  Webhook,
  LoginResponse,
} from '../types';
import * as faker from 'faker';

export function newMockLogin(): LoginResponse {
  return new LoginResponse(
    faker.internet.email(),
    faker.name.findName(),
    faker.commerce.productName(),
    'ashd8uado9012i31kod',
  );
}

export function newMockIntegration(): Integration {
  return new Integration(
    faker.random.alphaNumeric(15),
    faker.random.number(2),
    faker.name.firstName(),
    'v1',
    new Subscriber(
      'localhost:8080',
      '0x12u31ijdiasdjmi',
      'abi',
      ChainType.ETHEREUM,
    ),
    [
      new Handler(
        faker.random.alphaNumeric(),
        faker.name.firstName(),
        'event',
        'v1',
        faker.random.words(5),
        'tsnode8',
        'handler',
      ),
    ],
    new Webhook(faker.internet.ip(), 'POST', {
      Authorization: 'Bear ashd8uado9012i31kod',
    }),
    'Starting',
  );
}

export function newMockIntegrationSpec(): IntegrationSpec {
  return {
    version: 'v1',
    name: 'integration',
    contract: {
      address: '0xef3fbc3e228dbdc523ce5e58530874005553eb2e',
      path: __dirname + '/../../templates/contract/example.sol',
      name: 'example',
      compilerVersion: '0.5.8',
    },
    network: {
      type: 'klaytn',
      endpoint: 'http://localhost:8545',
    },
    handlers: {
      event1: {
        event: 'execution(address)',
        version: 'v1',
        runtime: 'tsnode8',
        path: __dirname + '/../../templates/handler/execution.ts',
        dep: __dirname + '/../../templates/handler/package.json',
        function: 'excution',
      } as HandlerSpec,
    },
    webhook: {
      url: 'https://localhost:8080',
      method: 'POST',
      headers: {
        Authorization: 'Bearer aisdjiajdais',
      },
    },
  } as IntegrationSpec;
}
