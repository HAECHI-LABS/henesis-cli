import 'reflect-metadata';

export enum PlatformType {
  ETHEREUM = 'ethereum',
  KLAYTN = 'klaytn',
}

export enum NetworkType {
  MAINNET = 'mainnet',
  ROPSTEN = 'ropsten',
  BAOBAB = 'baobab',
}

export class Provider {
  public type: string;
  public connectionLimit?: number;
  public url?: string;
  public method?: string;
  public retry?: {
    retryDelay: number;
    maxRetries: number;
  };
  public headers?: { [key: string]: string };

  public constructor(
    type: string,
    connectionLimit?: number,
    url?: string,
    method?: string,
    retry?: {
      retryDelay: number;
      maxRetries: number;
    },
    headers?: { [p: string]: string },
  ) {
    this.type = type;
    this.connectionLimit = connectionLimit;
    this.url = url;
    this.method = method;
    this.headers = headers;
    this.retry = retry;
  }
}

export class Filter {
  public contracts: Contract[];

  public constructor(contracts: Contract[]) {
    this.contracts = contracts;
  }
}

export class Blockchain {
  public platform: PlatformType;
  public network: NetworkType;
  public interval: number;
  public threshold: number;

  public constructor(
    platform: PlatformType,
    network: NetworkType,
    interval: number,
    threshold: number,
  ) {
    this.platform = platform;
    this.network = network;
    this.interval = interval;
    this.threshold = threshold;
  }
}

export class Contract {
  public name: string;
  public address: string;
  public abi: any;

  public constructor(name: string, address: string, abi: any) {
    this.name = name;
    this.address = address;
    this.abi = abi;
  }
}

export class UpdateIntegrationRequest {
  public version: string;
  public blockchain: Blockchain;
  public filter: Filter;
  public provider: Provider;

  public constructor(
    version: string,
    blockchain: Blockchain,
    filter: Filter,
    provider: Provider,
  ) {
    this.version = version;
    this.blockchain = blockchain;
    this.filter = filter;
    this.provider = provider;
  }
}

export class CreateIntegrationRequest {
  public name: string;
  public version: string;
  public blockchain: Blockchain;
  public filter: Filter;
  public provider: Provider;

  public constructor(
    name: string,
    version: string,
    blockchain: Blockchain,
    filter: Filter,
    provider: Provider,
  ) {
    this.name = name;
    this.version = version;
    this.blockchain = blockchain;
    this.filter = filter;
    this.provider = provider;
  }
}

export class Integration {
  public integrationId: string;
  public userId: number;
  public name: string;
  public version: string;
  public threshold: number;
  public interval: number;
  public platform: PlatformType;
  public network: NetworkType;
  public filter: Filter;
  public provider: Provider;
  public status: Status;

  public constructor(
    integrationId: string,
    userId: number,
    name: string,
    version: string,
    threshold: number,
    interval: number,
    platform: PlatformType,
    network: NetworkType,
    filter: Filter,
    provider: Provider,
    status: Status,
  ) {
    this.integrationId = integrationId;
    this.userId = userId;
    this.name = name;
    this.version = version;
    this.threshold = threshold;
    this.interval = interval;
    this.platform = platform;
    this.network = network;
    this.filter = filter;
    this.provider = provider;
    this.status = status;
  }
}

export class Status {
  public state: string;

  public constructor(state: string) {
    this.state = state;
  }
}
