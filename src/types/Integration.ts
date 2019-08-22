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
  public headers?: { [key: string]: string };

  public constructor(
    type: string,
    connectionLimit?: number,
    url?: string,
    method?: string,
    headers?: { [p: string]: string },
  ) {
    this.type = type;
    this.connectionLimit = connectionLimit;
    this.url = url;
    this.method = method;
    this.headers = headers;
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

export class Integration {
  public integrationId: string;
  public userId: number;
  public name: string;
  public version: string;
  public contractAddress: string;
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
    contractAddress: string,
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
    this.contractAddress = contractAddress;
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
