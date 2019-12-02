import { NodeStatus, BlockchainNodes } from '../types';
import { plainToClass } from 'class-transformer';
import { getWretcher } from './wretch';
import {
  trustedNodeBaseUrl,
  blockchainKinds,
  baseUrl,
  rpcVersion,
} from './config';
import { NodeDailyStat, NodeHourlyStat } from '../types/node';
import { getUserProperty, getSpecificDayOfMonth, startOfDay } from '../utils';

export class NodeRpc {
  private server: string;
  private rpcVersion: string;
  private trustedNodeBaseUrl: string;
  private blockchainNodes: BlockchainNodes;

  public constructor(
    server: string,
    version: string,
    trustedNodeBaseUrl: string,
    blockchainNodes: BlockchainNodes,
  ) {
    this.server = server + '/stats/' + version;
    this.rpcVersion = version;
    this.trustedNodeBaseUrl = trustedNodeBaseUrl;
    this.blockchainNodes = blockchainNodes;
  }

  public async dailyUsage(): Promise<NodeDailyStat[]> {
    const clientId = getUserProperty('clientId');
    const now = new Date().toISOString();
    // json rpc db record is created at tomorrow. 1 day time difference exists now.
    const startDate = getSpecificDayOfMonth(2).toISOString();

    const json = await getWretcher()
      .url(
        `${this.server}/jsonRpcDailyStats?clientId=${clientId}&start=${startDate}&end=${now}&size=31&page=0`,
      )
      .get()
      .error(404, err => {
        if (err.json.error.message === 'stats does not exist') {
          return {
            data: [],
          };
        }
      })
      .json()
      .catch((err: any) => {
        throw err;
      });

    if (!Array.isArray(json['data'])) {
      throw new Error(
        `Expected dailyUsage to return an array but it returned ${json['data']}`,
      );
    }

    return plainToClass(NodeDailyStat, json['data']);
  }

  public async hourlyUsage(): Promise<NodeHourlyStat[]> {
    const clientId = getUserProperty('clientId');
    const now = new Date().toISOString();
    // json rpc db record is created at 1 hour later. 1 hour time difference exists now.
    const startDate = startOfDay(1).toISOString();

    const json = await getWretcher()
      .url(
        `${this.server}/jsonRpcHourlyStats?clientId=${clientId}&start=${startDate}&end=${now}&size=24&page=0`,
      )
      .get()
      .error(404, err => {
        if (err.json.error.message === 'stats does not exist') {
          return {
            data: [],
          };
        }
      })
      .json()
      .catch((err: any) => {
        throw err;
      });

    if (!Array.isArray(json['data'])) {
      throw new Error(
        `Expected hourlyUsage to return an array but it returned ${json['data']}`,
      );
    }

    return plainToClass(NodeHourlyStat, json['data']);
  }

  public async status(): Promise<NodeStatus[]> {
    const nodeStatus: NodeStatus[] = [];

    for (const network of this.blockchainNodes.ethereum) {
      nodeStatus.push(this.statusToNodeStatus('ethereum', network));
    }

    // for (const network of this.blockchainNodes.klaytn) {
    //   nodeStatus.push(await this.getState('klaytn', network));
    // }

    return nodeStatus;
  }

  private statusToNodeStatus(blockchain: string, network: string): NodeStatus {
    const result = {
      platform: blockchain,
      network,
      endpoint: `${this.trustedNodeBaseUrl}/${blockchain}/${network}`,
    };
    return plainToClass(NodeStatus, result) as NodeStatus;
  }
}

const url = baseUrl();
const nodeRpc = new NodeRpc(
  url,
  rpcVersion,
  trustedNodeBaseUrl,
  blockchainKinds,
);
export default nodeRpc;
