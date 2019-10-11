import Command from '../common/base';
import { flags } from '@oclif/command';
import configstore from '../common/configstore';

export default class Config extends Command {
  public static hidden = true;

  public static description =
    "It's an internally hidden interface. You can set up endpoints.";

  public static examples = [
    `$ henesis config -e https://...
`,
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),
    endpoint: flags.string({
      char: 'e',
      description: 'Set the henesis endpoint.',
      required: true,
    }),
  };

  public static args = [];

  public async run(): Promise<void> {
    const { flags } = this.parse(Config);

    const re = new RegExp('^(https|http)://', 'i');

    if (re.test(flags.endpoint as string)) {
      configstore.set('endpoint', flags.endpoint);
      this.log(`Successfully set to ${flags.endpoint}`);
    } else {
      this.error(
        'You must enter url that matches the https form.\neg) $ henesis config -e https://api.henesis.io',
        { code: "101" }
      );
    }
  }
}
