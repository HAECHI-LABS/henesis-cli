import configstore from '../common/configstore';

const createUrlByTargetClusterEnv = (): string => {
  switch (process.env.TARGET_CLUSTER) {
    case 'dev':
      return 'https://dev.haechidev.com';
    case 'stage':
      return 'https://stage.haechidev.com';
    default:
      return 'https://privatebeta.henesis.io';
  }
};

export const baseUrl = (): string => {
  let url = createUrlByTargetClusterEnv();

  if (typeof configstore.get('endpoint') !== 'undefined') {
    url = configstore.get('endpoint');
  }

  return url;
};

export const rpcVersion = 'v1';
