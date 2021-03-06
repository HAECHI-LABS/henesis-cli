import configstore from '../../common/configstore';
import { default as UserRPC } from '../../rpc/user';
import Command from '../../common/base';
import { passwordPrompt } from '../../utils';

export default class Changepw extends Command {
  public static description = 'change account password';

  public static examples = [
    `$ henesis account:changepw
Password:
New Password:
Again New Password: 
`,
  ];
  //In order to use the Henesis CLI, you need to login first.

  //Please use the henesis login command to get started.
  public static flags = {};

  public static args = [];

  public async run(): Promise<void> {
    const user = configstore.get('user');
    if (!user) {
      this.error(
        'In order to use the Henesis CLI, you need to login first.\n' +
          'Please use the henesis login command to get started.',
        { code: '460' },
      );
    }

    try {
      const password = await passwordPrompt();
      const newPassword1 = await passwordPrompt('New Password');

      if (newPassword1.length < 6) {
        this.error('Password you enter must be at least 6 characters long.', {
          code: '461',
        });
      }
      const newPassword2 = await passwordPrompt('Again New Password');
      if (newPassword2.length < 6) {
        this.error('Password you enter must be at least 6 characters long.', {
          code: '461',
        });
      }

      if (newPassword1 !== newPassword2) {
        this.error('The newly entered password does not match.', {
          code: '462',
        });
      }

      await UserRPC.changePassword(password, newPassword1);
      this.log('🦄 Password changed!');
    } catch (err) {
      this.error(err);
    }
  }
}
