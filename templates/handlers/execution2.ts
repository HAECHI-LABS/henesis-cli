import { Ethereum } from '@haechi-labs/henesis-sdk';

exports.execution2 = (
  web3: any,
  event: Ethereum.Data,
  blockMeta: Ethereum.BlockMeta,
  userMeta: Ethereum.UserMeta,
): any => {
  console.log('event', event.payload);
  return event.payload;
};
