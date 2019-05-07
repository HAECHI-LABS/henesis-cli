import { ChainType, Handler, Integration, Subscriber, Webhook } from '../types';
import * as faker from 'faker';

export function newMockIntegration(): Integration {
  return new Integration(
    faker.random.alphaNumeric(15),
    faker.random.number(),
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
