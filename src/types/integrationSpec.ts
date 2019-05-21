import { PlatformType, NetworkType } from './Integration';

export interface IntegrationSpec {
  version: string;
  name: string;
  contract: {
    address: string;
    path: string;
    name: string;
    compilerVersion: string;
  };
  blockchain: {
    platform: PlatformType;
    network: NetworkType;
  };
  handlers: { [key: string]: HandlerSpec };
  webhook: WebhookSpec;
}

export interface HandlerSpec {
  event: string;
  version: string;
  runtime: string;
  path: string;
  dep: string;
  function: string;
}

export interface WebhookSpec {
  url: string;
  method: string;
  headers: { [key: string]: string };
}
