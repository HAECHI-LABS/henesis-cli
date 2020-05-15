import Command from '../../common/base';
import { cli } from 'cli-ux';
import NodeRpc from '../../rpc/node';
import { NodeDailyStat, NodeHourlyStat, NodeUsage } from '../../types';
import { formatBytes, formatNumbers } from '../../utils';

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
  bandwidth: {
    header: 'Bandwidth',
    minWidth: 10,
    get: (row: any) => row.bandwidth,
  },
};

interface Logger {
  log(message?: string, ...args: any[]): void;
}

abstract class UsageViewer {
  private logger: Logger;

  public constructor(logger: Logger) {
    this.logger = logger;
  }

  public display(
    nodeDailyStats: NodeDailyStat[],
    nodeHourlyStats: NodeHourlyStat[],
  ): void {
    if (nodeDailyStats.length !== 0 || nodeHourlyStats.length !== 0) {
      const filteredDailyStats = this.filterDailyStats(
        nodeDailyStats,
        this.getPlatform(),
      );
      const filteredHourlyStats = this.filterHourlyStats(
        nodeHourlyStats,
        this.getPlatform(),
      );

      const aggregatedStats = this.aggregateStats(
        filteredDailyStats,
        filteredHourlyStats,
      );

      this.logger.log(
        `Henesis Trusted Node (${this.getPlatform()}) Statistics`,
      );
      this.logger.log();
      this.logger.log(
        'Total rpc call of this month: ' +
          formatNumbers(
            this.getTotalUsage(filteredDailyStats, filteredHourlyStats),
          ),
      );
      this.logger.log(
        'This command shows the trusted node usage this month(The stat is updated every hour).',
      );
      this.logger.log('The daily statistic is added at UTC+0.');
      cli.table(aggregatedStats, columns, {
        printLine: this.logger.log,
      });
      this.logger.log();
      this.logger.log();
    } else {
      this.logger.log('Your trusted node statistics does not exist');
    }
  }

  abstract getPlatform(): string;

  private filterDailyStats(
    nodeDailyStats: NodeDailyStat[],
    platform: string,
  ): NodeDailyStat[] {
    return nodeDailyStats.filter(dailyStat => {
      return dailyStat.platform === platform;
    });
  }

  private filterHourlyStats(
    nodeHourlyStats: NodeHourlyStat[],
    platform: string,
  ): NodeHourlyStat[] {
    return nodeHourlyStats.filter(hourlyStat => {
      return hourlyStat.platform === platform;
    });
  }

  private getTotalUsage(
    filteredDailyStats: NodeDailyStat[],
    filteredHourlyStats: NodeHourlyStat[],
  ): number {
    return (
      filteredDailyStats.reduce((a, b) => {
        return a + b.count;
      }, 0) +
      filteredHourlyStats.reduce((a, b) => {
        return a + b.count;
      }, 0)
    );
  }

  private aggregateStats(
    filteredDailyStats: NodeDailyStat[],
    filteredHourlyStats: NodeHourlyStat[],
  ): NodeUsage[] {
    let nodeUsages: NodeUsage[] = [];

    if (filteredHourlyStats.length > 0) {
      nodeUsages.push(
        new NodeUsage(
          filteredHourlyStats[0].createdAt.split('T')[0],
          formatNumbers(
            filteredHourlyStats.reduce((a, b) => {
              return a + b.count;
            }, 0),
          ),
          formatBytes(
            filteredHourlyStats.reduce((a, b) => {
              return a + b.requestBytes + b.responseBytes;
            }, 0),
          ),
        ),
      );
    }

    filteredDailyStats.forEach(nodeDailyStat => {
      // json rpc db record is created at tomorrow. 1 day time difference exists now.
      const utcDate = new Date(
        Date.UTC(
          +nodeDailyStat.createdAt.substring(0, 4),
          +nodeDailyStat.createdAt.substring(5, 7) - 1,
          +nodeDailyStat.createdAt.substring(8, 10) - 1,
        ),
      ).toISOString();
      const nodeUsage = new NodeUsage(
        utcDate.split('T')[0],
        formatNumbers(nodeDailyStat.count),
        formatBytes(nodeDailyStat.requestBytes + nodeDailyStat.responseBytes),
      );
      nodeUsages.push(nodeUsage);
    });

    return nodeUsages;
  }
}

class EthUsageViewer extends UsageViewer {
  private readonly platform = 'ethereum';

  public constructor(logger: Logger) {
    super(logger);
  }

  public getPlatform() {
    return this.platform;
  }
}

class KlayUsageViewer extends UsageViewer {
  private readonly platform = 'klaytn';

  public constructor(logger: Logger) {
    super(logger);
  }

  public getPlatform() {
    return this.platform;
  }
}

export default class Usage extends Command {
  public static description = 'show truested node statistics';
  public static examples = [`$ henesis node:usage`];
  public static flags = {};
  public static args = [];

  public async run(): Promise<void> {
    try {
      // rpc call
      const [nodeDailyStats, nodeHourlyStats] = await Promise.all([
        NodeRpc.dailyUsage(),
        NodeRpc.hourlyUsage(),
      ]);
      new EthUsageViewer(this).display(nodeDailyStats, nodeHourlyStats);
      new KlayUsageViewer(this).display(nodeDailyStats, nodeHourlyStats);
    } catch (err) {
      this.error(err.message);
    }
  }
}
