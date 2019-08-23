import Command from '../../common/base';
import { cli } from 'cli-ux';
import integrationRpc from '../../rpc/integration';

export const columns = {
  integrationId: {
    header: 'Id',
    minWidth: 15,
  },
  name: {
    header: 'Name',
    minWidth: 10,
  },
  platform: {
    header: 'Platform',
    minWidth: 13,
  },
  network: {
    header: 'Network',
    minWidth: 10,
  },
  version: {
    header: 'Version',
    minWidth: 10,
  },
  provider: {
    header: 'Provider',
    minWidth: 13,
    get: (row: any) => row.provider.type,
  },
  state: {
    header: 'State',
    minWidth: 15,
    get: (row: any) => row.status && row.status.state,
  },
};

export default class Status extends Command {
  public static description = 'get integrations';
  public static examples = [`$ henesis integration:list`];
  public static flags = {};
  public static args = [];

  public async run(): Promise<void> {
    try {
      const integrations = await integrationRpc.getIntegrations();
      cli.table(integrations, columns, {
        printLine: this.log,
      });
    } catch (err) {
      this.error(err.message);
    }
  }
}
