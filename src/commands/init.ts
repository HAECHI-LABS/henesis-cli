import { Command, flags } from '@oclif/command';
import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const TEMPLATE_DIR = join(__dirname, '..', 'templates');
const MODE_0666 = parseInt('0666', 8);

export default class Init extends Command {
  public static description = 'describe the command here';

  public static examples = [
    `$ henesis init -n henesis
`,
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
      char: 'n',
      description: 'name to project',
      default: 'henesis',
    }),
    // flag with no value (-f, --force)
    force: flags.boolean({
      char: 'f',
      description: 'Delete existing folders and create new ones.',
      default: false,
    }),
  };

  public static args = [];

  public async run(): Promise<void> {
    const currentPath = process.cwd() || '.';
    const { flags } = this.parse(Init);
    const name = flags.name;

    const destinationPath = `${currentPath}/${name}`;

    if (existsSync(destinationPath) && flags.force === false) {
      this.error(`The directory exists at the current directory.`);
      await this.config.runHook('analyticsSend', {
        error: `The directory exists at the current directory.`,
      });
      this.exit(-1);
    }

    // TODO: with force.
    mkdirSync(`${destinationPath}`);
    writeFileSync(
      join(`${destinationPath}`, 'henesis.yaml'),
      readFileSync(join(`${TEMPLATE_DIR}`, 'henesis.yaml')),
      { mode: MODE_0666 },
    );
    mkdirSync(`${destinationPath}/handler`);
    writeFileSync(
      join(`${destinationPath}/handler`, 'execution.ts'),
      readFileSync(join(`${TEMPLATE_DIR}/handler`, 'execution.ts')),
      { mode: MODE_0666 },
    );
    writeFileSync(
      join(`${destinationPath}/handler`, 'execution2.ts'),
      readFileSync(join(`${TEMPLATE_DIR}/handler`, 'execution2.ts')),
      { mode: MODE_0666 },
    );
    writeFileSync(
      join(`${destinationPath}/handler`, 'package.json'),
      readFileSync(join(`${TEMPLATE_DIR}/handler`, 'package.json')),
      { mode: MODE_0666 },
    );
    mkdirSync(`${destinationPath}/contract`);
    writeFileSync(
      join(`${destinationPath}/contract`, 'example.sol'),
      readFileSync(join(`${TEMPLATE_DIR}/contract`, 'example.sol')),
      { mode: MODE_0666 },
    );

    await this.config.runHook('analyticsSend', { command: 'init' });
    this.log(`${name} directory has been created.`);
  }
}
