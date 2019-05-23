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
  version: {
    header: 'Version',
    minWidth: 10,
  },
  status: {
    header: 'Status',
    minWidth: 10,
  },
};

export default class Status extends Command {
  public static description = 'get integrations';
  public static examples = [`$ ql-cli integration:list`];
  public static flags = {};
  public static args = [];

  public async run(): Promise<void> {
    try {
      const integrations = await integrationRpc.getIntegrations();

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
