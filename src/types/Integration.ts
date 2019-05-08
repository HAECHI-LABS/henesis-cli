import 'reflect-metadata';

export class Integration {
  integrationId: string;
  userId: number;
  name: string;
  version: string;
  subscriber: Subscriber;
  handlers: Handler[];
  webhook: Webhook;
  status: string;

  constructor(
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
  id: string;
  name: string;
  event: string;
  version: string;
  code: string;
  runtime: string;
  'function': string;

  constructor(
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
  url: string;
  method: string;
  headers: { [key: string]: string };

  constructor(url: string, method: string, headers: { [key: string]: string }) {
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
  blockchainEndpoint: string;
  contractAddress: string;
  abi: string;
  type: ChainType;

  constructor(
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
