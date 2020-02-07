import Command from '../../common/base';
import { cli } from 'cli-ux';
import { IntegrationStat, SubscriptionUsage } from '../../types/Integration';
import { MISSING_INTEGRATIONID_ARGS } from '../../errors';
import integrationRpc from '../../rpc/integration';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  formatNumbers,
  getEndOfLastMonth,
  getStartOfLastMonth,
  getStartOfThisMonth,
} from '../../utils';

export const columns = {
  subscriptionId: {
    header: 'subscriptionId',
    minWidth: 16,
    get: (row: any) => row.subscriptionId,
  },
  events: {
    header: 'events',
    minWidth: 13,
    get: (row: any) => row.events,
  },
};
export default class Usage extends Command {
  public static description = 'show event streamer statistics';
  public static examples = [
    `$ henesis integration:usage my-integration-id-xqxz`,
  ];
  public static flags = {};
  public static args = [{ name: 'integrationId' }];

  public async run(): Promise<void> {
    const { args } = this.parse(Usage);
    if (args.integrationId === undefined) {
      this.error(MISSING_INTEGRATIONID_ARGS);
    }

    try {
      // Date Setting
      dayjs.extend(utc);
      const now = dayjs().utc();
      const startOfThisMonth = getStartOfThisMonth();
      const startOfLastMonth = getStartOfLastMonth();
      const endOfLastMonth = getEndOfLastMonth();

      // rpc call
      const [
        integrationStatOfThisMonth,
        integrationStatOfLastMonth,
      ] = await Promise.all([
        integrationRpc.getIntegrationUsage(
          args.integrationId,
          startOfThisMonth.toISOString(),
          now.toISOString(),
        ),
        integrationRpc.getIntegrationUsage(
          args.integrationId,
          startOfLastMonth.toISOString(),
          endOfLastMonth.toISOString(),
        ),
      ]);

      // parsing data
      const subscriptionUsageOfThisMonth = this.subscriptionUsageMapper(
        integrationStatOfThisMonth,
      );
      const subscriptionUsageOfLastMonth = this.subscriptionUsageMapper(
        integrationStatOfLastMonth,
      );

      // render CUI
      this.log('Henesis Event Streamer (Ethereum) Statistics');
      this.log('All times are in UTC+0.');
      const thisMonth =
        '[' +
        now.year().toString() +
        '/' +
        (now.month() + 1).toString() +
        ' (this month)]';
      const lastMonth =
        '[' +
        startOfLastMonth.getUTCFullYear().toString() +
        '/' +
        (startOfLastMonth.getUTCMonth() + 1).toString() +
        ' (last month)]';
      if (subscriptionUsageOfThisMonth.length > 0) {
        this.log();
        this.draw(thisMonth, subscriptionUsageOfThisMonth);
      } else {
        this.log();
        this.log(thisMonth);
        this.log();
        this.log('No usage data in this month');
      }
      this.log();
      this.log('------------------------');
      if (subscriptionUsageOfLastMonth.length > 0) {
        this.log();
        this.draw(lastMonth, subscriptionUsageOfLastMonth);
      } else {
        this.log();
        this.log(lastMonth);
        this.log();
        this.log('No usage data in last month');
      }
    } catch (err) {
      this.error(err.message);
    }
  }

  private draw(date: string, subscriptionUsage: SubscriptionUsage[]): void {
    const emptyArray: any = [];
    const title = {
      date: {
        header: date,
        minWidth: 16,
      },
    };
    cli.table(emptyArray, title, {
      printLine: this.log,
    });
    if (subscriptionUsage.length > 0) {
      this.log();
      cli.table(subscriptionUsage, columns, {
        printLine: this.log,
      });
    }
  }

  private subscriptionUsageMapper(stat: IntegrationStat): SubscriptionUsage[] {
    let subscriptionUsage: SubscriptionUsage[] = [];
    for (const subscription of stat.subscriptions) {
      subscriptionUsage.push(
        new SubscriptionUsage(
          subscription.id,
          formatNumbers(subscription.eventCount),
        ),
      );
    }
    return subscriptionUsage;
  }
}
