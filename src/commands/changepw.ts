import { Command } from '@oclif/command';
import cli from 'cli-ux';
import configstore from '../common/configstore';
import { default as UserRPC } from '../rpc/user';

export default class Changepw extends Command {
  public static description = 'Perform a change password';

  public static examples = [
    `$ henesis user:changepw
Password:
New Password:
Again New Password: 
`,
  ];

  public static flags = {};

  public static args = [];

  public async run(): Promise<void> {
    const user = configstore.get('user');
    if (!user) {
      this.error('You are not logged in.');
      this.exit(-1);
    }

    await this.config.runHook('analyticsSend', { command: 'changepw' });

    try {
      const password = await cli.prompt('Password', { type: 'hide' });
      const newPassword1 = await cli.prompt('New Password', { type: 'hide' });
      if (newPassword1.length < 6) {
        this.error('Password you enter must be at least 6 characters long.');
        this.exit(-1);
      }
      const newPassword2 = await cli.prompt('Again New Password', {
        type: 'hide',
      });
      if (newPassword2.length < 6) {
        this.error('Password you enter must be at least 6 characters long.');
        this.exit(-1);
      }

      if (newPassword1 !== newPassword2) {
        this.error('The newly entered password does not match.');
        this.exit(-1);
      }

      await UserRPC.changePassword(password, newPassword1);
      this.log('🦄 Password changed!');
    } catch (err) {
      await this.config.runHook('analyticsSend', { error: err });
      this.error(err);
      this.exit(-1);
    }
  }
}
