import 'reflect-metadata';

export class Integration {
  public integrationId: string;
  public userId: number;
  public name: string;
  public version: string;
  public subscriber: Subscriber;
  public handlers: Handler[];
  public webhook: Webhook;
  public status: string;

  public constructor(
    integrationId: string,
    userId: number,
    name: string,
    version: string,
    subscriber: Subscriber,
    handlers: Handler[],
    webhook: Webhook,
    status: string,
  ) {
    this.integrationId = integrationId;
    this.userId = userId;
    this.name = name;
    this.version = version;
    this.subscriber = subscriber;
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
  public runtime: string;
  public 'function': string;

  public constructor(
    id: string,
    name: string,
    event: string,
    version: string,
    code: string,
    runtime: string,
    func: string,
  ) {
    this.id = id;
    this.name = name;
    this.event = event;
    this.version = version;
    this.code = code;
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

export enum ChainType {
  ETHEREUM = 'ethereum',
  KLAYTN = 'klaytn',
}

export class Subscriber {
  public blockchainEndpoint: string;
  public contractAddress: string;
  public abi: string;
  public type: ChainType;

  public constructor(
    blockchainEndpoint: string,
    contractAddress: string,
    abi: string,
    type: ChainType,
  ) {
    this.blockchainEndpoint = blockchainEndpoint;
    this.contractAddress = contractAddress;
    this.abi = abi;
    this.type = type;
  }
}
