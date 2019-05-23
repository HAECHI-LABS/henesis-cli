import { Command } from '@oclif/command';
import configstore from '../common/configstore';

export default class Logout extends Command {
  public static description = 'Perform a logout';

  public static examples = [
    `$ henesis logout
`,
  ];

  public static flags = {};

  public static args = [];

  public async run(): Promise<void> {
    await this.config.runHook('analyticsSend', { command: 'logout' });
    configstore.delete('analytics');
    configstore.delete('user');
    this.log(`🤗 Logout Success 👍`);
  }
}
