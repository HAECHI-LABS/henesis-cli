import 'reflect-metadata';

export enum PlatformType {
  ETHEREUM = 'ethereum',
  KLAYTN = 'klaytn',
}

export enum NetworkType {
  MAINNET = 'mainnet',
  ROPSTEN = 'ropsten',
}

export class Integration {
  public integrationId: string;
  public userId: number;
  public name: string;
  public version: string;
  public abi: any;
  public contractAddress: string;
  public platform: PlatformType;
  public network: NetworkType;
  public handlers: Handler[];
  public webhook: Webhook;
  public status: string;

  public constructor(
    integrationId: string,
    userId: number,
    name: string,
    version: string,
    abi: any,
    contractAddress: string,
    platform: PlatformType,
    network: NetworkType,
    handlers: Handler[],
    webhook: Webhook,
    status: string,
  ) {
    this.integrationId = integrationId;
    this.userId = userId;
    this.name = name;
    this.version = version;
    this.abi = abi;
    this.contractAddress = contractAddress;
    this.platform = platform;
    this.network = network;
    this.handlers = handlers;
    this.webhook = webhook;
    this.status = status;
  }
}

export class Handler {
  public id: string;
  public name: string;
  public event: string;
  public version: string;
  public code: string;
  public dep: string;
  public runtime: string;
  public 'function': string;

  public constructor(
    id: string,
    name: string,
    event: string,
    version: string,
    code: string,
    dep: string,
    runtime: string,
    func: string,
  ) {
    this.id = id;
    this.name = name;
    this.event = event;
    this.version = version;
    this.code = code;
    this.dep = dep;
    this.runtime = runtime;
    this.function = func;
  }
}

export class Webhook {
  public url: string;
  public method: string;
  public headers: { [key: string]: string };

  public constructor(
    url: string,
    method: string,
    headers: { [key: string]: string },
  ) {
    this.url = url;
    this.method = method;
    this.headers = headers;
  }
}
