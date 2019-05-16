import { ChainType } from './Integration';

export interface IntegrationSpec {
  version: string;
  name: string;
  contract: {
    address: string;
    path: string;
    name: string;
    compilerVersion: string;
  };
  network: {
    endpoint: string,
    type: ChainType;
  };
  handlers: { [key: string]: HandlerSpec };
  webhook: WebhookSpec;
}

export interface HandlerSpec {
  event: string;
  version: string;
  runtime: string;
  path: string;
  function: string;
}

export interface WebhookSpec {
  url: string;
  method: string;
  headers: { [key: string]: string };
}