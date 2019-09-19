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
export class BlockchainNodes {
  public ethereum: string[];
  public klaytn: string[];
  public constructor(ethereum: string[], klaytn: string[]) {
    this.ethereum = ethereum;
    this.klaytn = klaytn;
  }
}
