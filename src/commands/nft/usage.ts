import Command from '../../common/base';
import { cli } from 'cli-ux';
import { formatBytes, formatNumbers } from '../../utils';
import { NFTDailyStat, NFTUsage } from '../../types/nft';
import NFTHttp from '../../rpc/nft';
import { NodeDailyStat, NodeHourlyStat, NodeUsage } from '../../types';

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
      const [nftDailyStats] = await Promise.all([NFTHttp.dailyUsage()]);

      if (nftDailyStats.length !== 0) {
        const ethStats = this.aggregateStats(nftDailyStats);

        this.log('Henesis NFT API (Ethereum) Statistics');
        this.log();
        this.log(
          'Total api call of this month: ' +
            formatNumbers(this.getTotalUsage(nftDailyStats)),
        );
        this.log(
          'This command shows the nft api usage this month.',
        );
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
      // json rpc db record is created at tomorrow. 1 day time difference exists now.
      const utcDate = new Date(
        Date.UTC(
          +nodeDailyStat.date.substring(0, 4),
          +nodeDailyStat.date.substring(5, 7) - 1,
          +nodeDailyStat.date.substring(8, 10) - 1,
        ),
      ).toISOString();
      const nftUsage = new NFTUsage(
        utcDate.split('T')[0],
        formatNumbers(nodeDailyStat.count),
      );
      nftUsages.push(nftUsage);
    });

    return nftUsages;
  }
}
