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
  headers: { [key: string]: string };
}

export interface ContractSpec {
  address: string;
  name: string;
  files: ContractFileSpec[];
}

export interface ContractFileSpec {
  path: string;
  contractName: string;
  compilerVersion: string;
}
