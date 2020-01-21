export class NodeStatus {
  public platform: string;
  public network: string;
  public endpoint: string;
  public state: string;
  public constructor(
    platform: string,
    network: string,
    endpoint: string,
    state: string,
  ) {
    this.platform = platform;
    this.network = network;
    this.endpoint = endpoint;
    this.state = state;
  }
}
export class NodeDailyStat {
  public id: number;
  public clientId: string;
  public count: number;
  public requestBytes: number;
  public responseBytes: number;
  public createdAt: string;
  public jobId: number;
  public platform: string;

  public constructor(
    id: number,
    clientId: string,
    count: number,
    requestBytes: number,
    responseBytes: number,
    createdAt: string,
    jobId: number,
    platform: string,
  ) {
    this.id = id;
    this.clientId = clientId;
    this.count = count;
    this.requestBytes = requestBytes;
    this.responseBytes = responseBytes;
    this.createdAt = createdAt;
    this.jobId = jobId;
    this.platform = platform;
  }
}
export class NodeHourlyStat {
  public id: number;
  public clientId: string;
  public count: number;
  public platform: string;
  public requestBytes: number;
  public responseBytes: number;
  public createdAt: string;
  public hour: number;
  public jobId: number;

  public constructor(
    id: number,
    clientId: string,
    count: number,
    platform: string,
    requestBytes: number,
    responseBytes: number,
    createdAt: string,
    hour: number,
    jobId: number,
  ) {
    this.id = id;
    this.clientId = clientId;
    this.count = count;
    this.platform = platform;
    this.requestBytes = requestBytes;
    this.responseBytes = responseBytes;
    this.createdAt = createdAt;
    this.hour = hour;
    this.jobId = jobId;
  }
}
export class NodeUsage {
  public date: string;
  public usage: string;
  public bandwidth: string;
  public constructor(date: string, usage: string, bandwidth: string) {
    this.date = date;
    this.usage = usage;
    this.bandwidth = bandwidth;
  }
}
export class BlockchainNodes {
  public ethereum: string[];
  public klaytn: string[];
  public constructor(ethereum: string[], klaytn: string[]) {
    this.ethereum = ethereum;
    this.klaytn = klaytn;
  }
}
