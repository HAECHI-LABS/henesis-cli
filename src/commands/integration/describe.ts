import { Command, flags } from '@oclif/command';
import integrationRpc from '../../rpc/integration';

export default class Describe extends Command {
  public static description = 'describe a integration';
  public static examples = [`$ ql-cli integration:delete`];
  public static flags = {};
  public static args = [{ name: 'integrationId' }];

  public async run() {
    const { args } = this.parse(Describe);
    if (args.integrationId === undefined) {
      this.error('integrationId is undefined', { exit: 1 });
    }

    try {
      const integration = await integrationRpc.getIntegration(
        args.integrationId,
      );
      this.log(JSON.stringify(integration, undefined, 2));
    } catch (err) {
      this.error(err, { exit: 1 });
    }
  }
}
