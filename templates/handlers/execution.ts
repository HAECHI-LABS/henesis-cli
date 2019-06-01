import { Ethereum } from '@haechi-labs/henesis-sdk';

exports.execution = (web3: any, data: Ethereum.Data): any => {
  console.log('event', data);
  return data;
};
