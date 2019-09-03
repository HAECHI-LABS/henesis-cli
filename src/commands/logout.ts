import configstore from '../common/configstore';
import Command from '../common/base';

export default class Logout extends Command {
  public static description = 'perform a logout';

  public static examples = [
    `$ henesis logout
`,
  ];

  public static flags = {};

  public static args = [];

  public async run(): Promise<void> {
    configstore.delete('analytics');
    configstore.delete('user');
    this.log(`🤗 Logout Success 👍`);
  }
}
