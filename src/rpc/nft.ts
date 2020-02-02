import { plainToClass } from 'class-transformer';
import { getWretcher } from './wretch';
import { trustedNodeBaseUrl, baseUrl, rpcVersion } from './config';
import { getUserProperty, getSpecificDayOfMonth } from '../utils';
import { NFTDailyStat } from '../types';
import configstore from '../common/configstore';

export class NFTHttp {
  private server: string;
  private rpcVersion: string;
  private trustedNodeBaseUrl: string;

  public constructor(
    server: string,
    version: string,
    trustedNodeBaseUrl: string,
  ) {
    this.server = server + '/nft/' + version + '/stats';
    this.rpcVersion = version;
    this.trustedNodeBaseUrl = trustedNodeBaseUrl;
  }

  public async dailyUsage(): Promise<NFTDailyStat[]> {
    const clientId = getUserProperty('clientId');
    const now = new Date().toISOString().split('T')[0];
    // json rpc db record is created at tomorrow. 1 day time difference exists now.
    const startDate = getSpecificDayOfMonth(2).toISOString().split('T')[0];
    const json = await getWretcher()
      .url(
        `${this.server}/jsonRpcDailyStats?clientId=${clientId}&start=${startDate}&end=${now}&size=31&page=0&order_by=date&order_direction=DESC`,
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

    return plainToClass(NFTDailyStat, json['data']);
  }
}

configstore.set('nft', true);
const url = baseUrl();
const nftHttp = new NFTHttp(url, rpcVersion, trustedNodeBaseUrl);
export default nftHttp;
