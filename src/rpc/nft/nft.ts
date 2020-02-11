import { plainToClass } from 'class-transformer';
import { getWretcher } from '../wretch';
import { rpcVersion } from './url';
import { getUserProperty } from '../../utils';
import { NFTDailyStat } from '../../types';
import { nftBaseUrl } from './url';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export class NFTRpc {
  private server: string;
  private rpcVersion: string;

  public constructor(server: string, version: string) {
    this.server = server + '/nft/' + version + '/stats';
    this.rpcVersion = version;
  }

  public async dailyUsage(): Promise<NFTDailyStat[]> {
    const clientId = getUserProperty('clientId');
    // Date Setting
    dayjs.extend(utc);
    let now = dayjs().utc();
    const startDate = now
      .startOf('month')
      .add(1, 'day')
      .format('YYYY-MM-DD');
    const nowDate = now.format('YYYY-MM-DD');

    const json = await getWretcher()
      .url(
        `${this.server}/jsonRpcDailyStats?clientId=${clientId}&start=${startDate}&end=${nowDate}&size=31&page=0&order_by=date&order_direction=DESC`,
      )
      .get()
      .error(404, err => {
        if (err.json.error.message === 'stats does not exist') {
          return {
            data: [],
          };
        }
      })
      .error(401, err => {
        if (err.json.error.message === 'Unauthorized user') {
          throw new Error('Unauthorized user (please log in again or check clientId)');
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

const url = nftBaseUrl();
export default new NFTRpc(url, rpcVersion);
