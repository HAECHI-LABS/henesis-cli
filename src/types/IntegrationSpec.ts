import { PlatformType, NetworkType } from './Integration';

export interface IntegrationSpec {
  version: string;
  name: string;
  blockchain: {
    platform: PlatformType;
    network: NetworkType;
    threshold: number;
  };
  filters: {
    contracts: ContractSpec[];
  };
  provider: ProviderSpec;
}

export interface ProviderSpec {
  type: string;
  url: string;
  method: string;
  retry: {
    retryDelay: number;
    maxRetries: number;
  };
  headers: { [key: string]: string };
}

export interface ContractSpec {
  name: string;
  address: string;
  path: string;
  compilerVersion: string;
}
