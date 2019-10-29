import {
  PlatformType,
  NetworkType,
  Integration,
  IntegrationSpec,
  LoginResponse,
  Filter,
  Provider,
  Blockchain,
  DescribeResponse,
} from '../types';
import * as faker from 'faker';
import { Status } from '../types';

export function newMockLogin(): LoginResponse {
  return new LoginResponse(
    faker.internet.email(),
    faker.name.findName(),
    faker.commerce.productName(),
    'ashd8uado9012i31kod',
  );
}

export function newMockAccount(): DescribeResponse {
  return new DescribeResponse(
    faker.internet.email(),
    faker.name.findName(),
    faker.commerce.productName(),
    'jcashd8uoa9p012i31kod',
  );
}

export function newMockIntegration(): Integration {
  return new Integration(
    faker.random.alphaNumeric(15),
    faker.random.number(2),
    'asdf',
    'v1',
    new Blockchain(PlatformType.ETHEREUM, NetworkType.MAINNET, 3),
    new Filter([
      {
        abi: [
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
        address: '0x213',
        name: faker.random.alphaNumeric(15),
      },
    ]),
    new Provider('webhook'),
    new Status('Available'),
  );
}

export function newMockIntegrationSpec(): IntegrationSpec {
  return {
    version: 'v1',
    name: 'integration',
    blockchain: {
      platform: PlatformType.KLAYTN,
      network: NetworkType.MAINNET,
      threshold: 5,
    },
    filters: {
      contracts: [
        {
          address: '0xef3fbc3e228dbdc523ce5e58530874005553eb2e',
          name: 'example',
          files: [
            {
              path: `${__dirname}/../../templates/contracts/example.sol`,
              contractName: 'example',
              compilerVersion: '0.5.8',
            },
          ],
        },
      ],
    },
    provider: {
      type: 'webhook',
      url: 'https://localhost:8080',
      method: 'POST',
      headers: {
        Authorization: 'Bearer aisdjiajdais',
      },
      timeout: 10000,
    },
  };
}
