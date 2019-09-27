import userRpc from '../../rpc/user';
import Command from '../../common/base';
import configstore from '../../common/configstore';

export default class Describe extends Command {
  public static description = 'describe account information';

  public static examples = [`$ henesis account:describe`];

  public static flags = {};

  public static args = [];

  public async run(): Promise<void> {
    const user = configstore.get('user');
    if (!user) {
      this.error('You are not logged in.');
      //TODO: Enhancement: redirect to login prompt
    }

    try {
      const userResponse = await userRpc.describe();
      this.log(`Email: ${userResponse.email}`);
      this.log(`Name: ${userResponse.name}`);
      this.log(`Organization: ${userResponse.organization}`);
      this.log(`clientId: ${userResponse.clientId}`);
    } catch (err) {
      this.error(err.message);
    }
  }
}
