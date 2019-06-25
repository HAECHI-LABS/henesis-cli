import integrationRpc from '../../rpc/integration';
import { MISSING_INTEGRATIONID_ARGS } from '../../errors';
import Command from '../../common/base';

export default class Describe extends Command {
  public static description = 'describe a integration';
  public static examples = [
    `$ henesis integration:describe my-integration-id-xqxz`,
  ];
  public static flags = {};
  public static args = [{ name: 'integrationId' }];

  public async run(): Promise<void> {
    const { args } = this.parse(Describe);
    if (args.integrationId === undefined) {
      this.error(MISSING_INTEGRATIONID_ARGS);
    }

    try {
      const integration = await integrationRpc.getIntegration(
        args.integrationId,
      );
      this.log(JSON.stringify(integration, undefined, 2));
    } catch (err) {
      this.error(err.message);
    }
  }
}
