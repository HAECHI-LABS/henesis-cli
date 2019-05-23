import {
  PlatformType,
  NetworkType,
  Handler,
  Integration,
  IntegrationSpec,
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
    'asdf',
    'v1',
    [
      {
        constant: false,
        inputs: [
          {
            name: 'to',
            type: 'address',
          },
        ],
        name: 'delegate',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'winningProposal',
        outputs: [
          {
            name: '_winningProposal',
            type: 'uint8',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: 'toVoter',
            type: 'address',
          },
        ],
        name: 'giveRightToVote',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: 'toProposal',
            type: 'uint8',
          },
        ],
        name: 'vote',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            name: '_numProposals',
            type: 'uint8',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
    ],
    '0x12u31ijdiasdjmi',
    PlatformType.ETHEREUM,
    NetworkType.MAINNET,
    [
      new Handler(
        faker.random.alphaNumeric(),
        faker.name.firstName(),
        'event',
        'v1',
        faker.random.words(5),
        'dep',
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
    blockchain: {
      platform: PlatformType.KLAYTN,
      network: NetworkType.MAINNET,
    },
    handlers: {
      event1: {
        event: 'execution(address)',
        version: 'v1',
        runtime: 'tsnode8',
        path: __dirname + '/../../templates/handler/execution.ts',
        dep: __dirname + '/../../templates/handler/package.json',
        function: 'excution',
      },
    },
    webhook: {
      url: 'https://localhost:8080',
      method: 'POST',
      headers: {
        Authorization: 'Bearer aisdjiajdais',
      },
    },
  };
}
