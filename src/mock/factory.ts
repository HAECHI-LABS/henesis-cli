import { ChainType, Handler, HandlerSpec, Integration, IntegrationSpec, Subscriber, Webhook } from '../types';
import * as faker from 'faker';

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

export function newMockIntegrationSpec(): IntegrationSpec{
  return {
    version: 'v1',
    name: 'integration',
    contract: {
      address: '0xef3fbc3e228dbdc523ce5e58530874005553eb2e',
      path: __dirname + '/../../example/contract/erc20.sol',
      name: 'BNB',
      compilerVersion: '0.4.12'
    },
    network: {
      type: 'klaytn',
      endpoint: 'http://localhost:8545',
    },
    handlers: {
      transfer: {
        event: 'transfer(address,address,uint256)',
        version: 'v1',
        runtime: 'tsnode8',
        path: __dirname + '/../../example/handler/handler.js',
        function: 'handler',
      } as HandlerSpec
    },
    webhook: {
      url: 'localhost:8080',
      method: 'POST',
      headers: {
        Authorization: 'Bearer aisdjiajdais',
      }
    }
  } as IntegrationSpec
}
