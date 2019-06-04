import { Command } from '@oclif/command';
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
    minWidth: 10,
  },
  network: {
    header: 'Network',
    minWidth: 10,
  },
  version: {
    header: 'Version',
    minWidth: 10,
  },
  state: {
    header: 'State',
    minWidth: 15,
    get: (row: any) => row.status && row.status.state,
  },
  ready: {
    header: 'Ready',
    minWidth: 10,
    get: (row: any): any => {
      return `${row.status.ready}/${row.handlers.length}`;
    },
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

      cli.url('View Dashboard,', 'https://dashbard.henesis.io');
      this.log('You can login with the same email and password as henesis.');

      cli.table(integrations, columns, {
        printLine: this.log,
      });
      await this.config.runHook('analyticsSend', {
        command: 'integration:list',
      });
    } catch (err) {
      await this.config.runHook('analyticsSend', { error: err });
      this.error(err.message, { exit: 1 });
    }
  }
}
