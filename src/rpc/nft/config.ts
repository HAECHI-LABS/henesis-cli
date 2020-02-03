import configstore from '../../common/configstore';

export const nftBaseUrl = (): string => {
  let url = 'https://eth-mainnet.api.henesis.io';

  if (process.env.HENESIS_TEST === 'true') {
    url = 'http://localhost:8080';
  }

  return url;
};

export const rpcVersion = 'v1';
