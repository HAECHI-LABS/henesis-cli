import integrationRpc from '../../rpc/integration';
import { MISSING_INTEGRATIONID_ARGS } from '../../errors';
import Command from '../base';

export default class Delete extends Command {
  public static description = 'delete a integration';
  public static examples = [
    `$ henesis integration:delete my-integration-id-xqxz`,
  ];
  public static flags = {};
  public static args = [{ name: 'integrationId' }];

  public async run(): Promise<void> {
    const { args } = this.parse(Delete);
    if (args.integrationId === undefined) {
      this.error(MISSING_INTEGRATIONID_ARGS);
    }

    try {
      await integrationRpc.deleteIntegration(args.integrationId);
      this.log(`${args.integrationId} has been deleted`);
    } catch (err) {
      this.error(err.message);
    }
  }
}
