import cli from 'cli-ux';
import configstore from '../common/configstore';
import { default as UserRPC } from '../rpc/user';
import Command from './base';
import { passwordPrompt } from '../utils';

export default class Changepw extends Command {
  public static description = 'Change password';

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
    }

    try {
      const password = await passwordPrompt();
      const newPassword1 = await passwordPrompt('New Password');

      if (newPassword1.length < 6) {
        this.error('Password you enter must be at least 6 characters long.');
      }
      const newPassword2 = await passwordPrompt('Again New Password');
      if (newPassword2.length < 6) {
        this.error('Password you enter must be at least 6 characters long.');
      }

      if (newPassword1 !== newPassword2) {
        this.error('The newly entered password does not match.');
      }

      await UserRPC.changePassword(password, newPassword1);
      this.log('🦄 Password changed!');
    } catch (err) {
      this.error(err);
    }
  }
}
