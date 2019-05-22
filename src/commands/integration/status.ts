import { Command } from '@oclif/command';
import integrationRpc from '../../rpc/integration';

export function buildMsg(
  id: string,
  name: string,
  network: string,
  version: string,
  status: string,
): string {
  return (
    id.padEnd(20) +
    name.padEnd(15) +
    network.padEnd(15) +
    version.padEnd(15) +
    status.padEnd(15) +
    '\n'
  );
}

export default class Status extends Command {
  public static description = 'get integrations';
  public static examples = [`$ henesis integration:list`];
  public static flags = {};
  public static args = [];

  public async run() {
    try {
      const integrations = await integrationRpc.getIntegrations();
      let msg = buildMsg('ID', 'Name', 'Network', 'Version', 'Status');
      for (let integration of integrations) {
        msg =
          msg +
          buildMsg(
            integration.integrationId,
            integration.name,
            integration.platform,
            integration.version,
            integration.status,
          );
      }
      await this.config.runHook('analyticsSend', {
        command: 'integration:list',
      });
      this.log(msg.substring(0, msg.length - 1));
    } catch (err) {
      await this.config.runHook('analyticsSend', { error: err });
      this.error(err.message, { exit: 1 });
    }
  }
}
