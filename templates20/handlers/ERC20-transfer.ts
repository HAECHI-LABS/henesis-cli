import { Ethereum } from '@haechi-labs/henesis-sdk';

exports.transfer = (web3: any, data: Ethereum.Data): any => {
  console.log('event', data);
  return data;
};
