import configstore from '../common/configstore';
import { BlockchainNodes } from '../types';

export const baseUrl = (): string => {
  let url = 'https://privatebeta.henesis.io';

  if (typeof configstore.get('endpoint') !== 'undefined') {
    url = configstore.get('endpoint');
  }

  if (process.env.HENESIS_TEST === 'true') {
    url = 'http://localhost:8080';
  }

  return url;
};

export const rpcVersion = 'v1';