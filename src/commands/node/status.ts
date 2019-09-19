import Command from '../../common/base';
import { cli } from 'cli-ux';
import NodeRpc from '../../rpc/node';

export const columns = {
  platform: {
    header: 'Platform',
    minWidth: 13,
    get: (row: any) => row.platform,
  },
  network: {
    header: 'Network',
    minWidth: 10,
    get: (row: any) => row.network,
  },
  endpoint: {
    header: 'Endpoint',
    minWidth: 10,
    get: (row: any) => row.endpoint,
  },
  status: {
    header: 'Status',
    minWidth: 15,
    get: (row: any) => row.status,
  },
};

export default class Status extends Command {
  public static description = 'get node status';
  public static examples = [`$ henesis node:status`];
  public static flags = {};
  public static args = [];

  public async run(): Promise<void> {
    try {
      const states = await NodeRpc.status();
      cli.table(states, columns, {
        printLine: this.log,
      });
    } catch (err) {
      this.error(err.message);
    }
  }
}
