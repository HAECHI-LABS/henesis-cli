import { NodeStatus } from '../types';
import { plainToClass } from 'class-transformer';
import { getWretcher } from './wretch';
import { trustedNodeBaseUrl, blockchainKinds } from './config';
import { BlockchainNodes } from '../types/node';

export class NodeRpc {
  private trustedNodeBaseUrl: string;
  private blockchainNodes: BlockchainNodes;
  private rpcId: number = 0;

  public constructor(
    trustedNodeBaseUrl: string,
    blockchainNodes: BlockchainNodes,
  ) {
    this.trustedNodeBaseUrl = trustedNodeBaseUrl;
    this.blockchainNodes = blockchainNodes;
  }

  public async status(): Promise<NodeStatus[]> {
    const nodeStatus: NodeStatus[] = [];

    for (const network of this.blockchainNodes.ethereum) {
      nodeStatus.push(await this.getState('ethereum', network));
    }

    for (const network of this.blockchainNodes.klaytn) {
      nodeStatus.push(await this.getState('klaytn', network));
    }

    return nodeStatus;
  }
  public async getState(
    blockchain: string,
    network: string,
  ): Promise<NodeStatus> {
    let status = 'Unknown';
    let json: any;
    
    json = await getWretcher()
      .url(`${this.trustedNodeBaseUrl}/${blockchain}/${network}`)
      .post(this.buildPayload(blockchain))
      .json()
      .catch(error => status = "Down");

    const { result } = json;

    if (result === false) {
      status = 'Synced';
    }
    if (typeof result === 'object') {
      status = 'Not Synced';
    }
    return this.statusToNodeStatus(status, blockchain, network);
  }

  private buildPayload(blockchain: string) {
    this.rpcId += 1;

    switch (blockchain) {
      case 'ethereum':
        return {
          jsonrpc: '2.0',
          method: 'eth_syncing',
          params: [],
          id: this.rpcId,
        };
      case 'klaytn':
        return {
          jsonrpc: '2.0',
          method: 'klay_syncing',
          params: [],
          id: this.rpcId,
        };
      default:
        throw Error('invalid blockchain');
    }
  }
  private statusToNodeStatus(
    status: string,
    blockchain: string,
    network: string,
  ): NodeStatus {
    const result = {
      platform: blockchain,
      network,
      endpoint: `${this.trustedNodeBaseUrl}/${blockchain}/${network}`,
      status,
    };
    return plainToClass(NodeStatus, result) as NodeStatus;
  }
}

export default new NodeRpc(trustedNodeBaseUrl, blockchainKinds);
