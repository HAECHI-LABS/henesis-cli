import Command from '../../common/base';
import { cli } from 'cli-ux';
import { formatNumbers } from '../../utils';
import { NFTDailyStat, NFTUsage } from '../../types';
import NFTRpc from '../../rpc/nft/nft';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import nft from '../../rpc/nft/nft';

export const columns = {
  date: {
    header: 'Date',
    minWidth: 13,
    get: (row: any) => row.date,
  },
  usage: {
    header: 'Usage',
    minWidth: 13,
    get: (row: any) => row.usage,
  },
};

export default class Usage extends Command {
  public static description = 'show nft api statistics';
  public static examples = [`$ henesis nft:usage`];
  public static flags = {};
  public static args = [];

  public async run(): Promise<void> {
    try {
      const [nftDailyStats] = await Promise.all([NFTRpc.dailyUsage()]);

      if (nftDailyStats.length !== 0) {
        const ethStats = this.aggregateStats(this.addUnusedDays(nftDailyStats));

        this.log('Henesis NFT API (Ethereum) Statistics');
        this.log();
        this.log(
          'Total api call of this month: ' +
            formatNumbers(this.getTotalUsage(nftDailyStats)),
        );
        this.log('This command shows the nft api usage this month.');
        cli.table(ethStats, columns, {
          printLine: this.log,
        });
      } else {
        this.log('Your nft api statistics does not exist');
      }
    } catch (err) {
      this.error(err.message);
    }
  }

  private getTotalUsage(filteredDailyStats: NFTDailyStat[]): number {
    return filteredDailyStats.reduce((a, b) => {
      return a + b.count;
    }, 0);
  }

  private aggregateStats(filteredDailyStats: NFTDailyStat[]): NFTUsage[] {
    let nftUsages: NFTUsage[] = [];

    filteredDailyStats.forEach(nodeDailyStat => {
      // nft gets the real time stat. so you don't need to -1 like node usage.
      const nftUsage = new NFTUsage(
        nodeDailyStat.date.split('T')[0],
        formatNumbers(nodeDailyStat.count),
      );
      nftUsages.push(nftUsage);
    });

    return nftUsages;
  }

  private addUnusedDays(nftDailyStats: NFTDailyStat[]): NFTDailyStat[] {
    dayjs.extend(utc);
    let now = dayjs().utc();
    let nowDate = now.format('YYYY-MM-DD');

    for (
      let index = 0;
      index < now.date();
      nowDate = now.add(-(index + 1), 'day').format('YYYY-MM-DD'), index++
    ) {
      if (nftDailyStats[index] == undefined) {
        nftDailyStats.push(new NFTDailyStat(nowDate, 0));
        continue;
      }

      if (nowDate != nftDailyStats[index].date) {
        nftDailyStats.splice(index, 0, new NFTDailyStat(nowDate, 0));
      }
    }

    return nftDailyStats;
  }
}
