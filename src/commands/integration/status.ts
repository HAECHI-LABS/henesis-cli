import { Command } from '@oclif/command';
import integrationRpc from '../../rpc/integration';

export default class Status extends Command {
  public static description = 'get integrations';
  public static examples = [`$ ql-cli integration:list`];
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
            integration.subscriber.type,
            integration.version,
            integration.status,
          );
      }
      this.log(msg);
    } catch (err) {
      this.error(err, { exit: 1 });
    }
  }
}

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
