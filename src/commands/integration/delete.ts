import { Command, flags } from '@oclif/command';
import integrationRpc from '../../rpc/integration';

export default class Delete extends Command {
  public static description = 'delete a integration';
  public static examples = [`$ henesis integration:delete my-integration-id-xqxz`];
  public static flags = {};
  public static args = [{ name: 'integrationId' }];

  public async run() {
    const { args } = this.parse(Delete);
    if (args.integrationId === undefined) {
      this.error('integrationId is undefined', { exit: 1 });
    }

    try {
      await integrationRpc.deleteIntegration(args.integrationId);
      await this.config.runHook('analyticsSend', {
        command: 'integration:delete',
      });
      this.log(`${args.integrationId} has been deleted`);
    } catch (err) {
      await this.config.runHook('analyticsSend', { error: err });
      this.error(err.message, { exit: 1 });
    }
  }
}
