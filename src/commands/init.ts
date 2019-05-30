import { Command, flags } from '@oclif/command';
import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const TEMPLATE_DIR = join(__dirname, '..', '..', 'templates');
const TEMPLATE_ERC20_DIR = join(__dirname, '..', '..', 'templates20');
const MODE_0666 = parseInt('0666', 8);

export default class Init extends Command {
  public static description =
    'Create the folder structure required for your project.';

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
    erc20: flags.boolean({
      char: 'e',
      description: 'Create an ERC20 template project.',
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

    const dir = flags.erc20 ? TEMPLATE_ERC20_DIR : TEMPLATE_DIR;

    mkdirSync(`${destinationPath}`);
    writeFileSync(
      join(`${destinationPath}`, 'henesis.yaml'),
      readFileSync(join(`${dir}`, 'henesis.yaml')),
      {
        mode: MODE_0666,
      },
    );

    // TODO: with force.
    if (flags.erc20 === true) {
      mkdirSync(`${destinationPath}/handlers`);
      writeFileSync(
        join(`${destinationPath}/handlers`, 'ERC20-approval.ts'),
        readFileSync(join(`${dir}/handlers`, 'ERC20-approval.ts')),
        { mode: MODE_0666 },
      );
      writeFileSync(
        join(`${destinationPath}/handlers`, 'ERC20-transfer.ts'),
        readFileSync(join(`${dir}/handlers`, 'ERC20-transfer.ts')),
        { mode: MODE_0666 },
      );
      writeFileSync(
        join(`${destinationPath}/handlers`, 'package.json'),
        readFileSync(join(`${dir}/handlers`, 'package.json')),
        { mode: MODE_0666 },
      );
      mkdirSync(`${destinationPath}/contracts`);
      writeFileSync(
        join(`${destinationPath}/contracts`, 'ERC20.sol'),
        readFileSync(join(`${dir}/contracts`, 'ERC20.sol')),
        { mode: MODE_0666 },
      );
    } else {
      mkdirSync(`${destinationPath}/handlers`);
      writeFileSync(
        join(`${destinationPath}/handlers`, 'execution.ts'),
        readFileSync(join(`${dir}/handlers`, 'execution.ts')),
        { mode: MODE_0666 },
      );
      writeFileSync(
        join(`${destinationPath}/handlers`, 'execution2.ts'),
        readFileSync(join(`${dir}/handlers`, 'execution2.ts')),
        { mode: MODE_0666 },
      );
      writeFileSync(
        join(`${destinationPath}/handlers`, 'package.json'),
        readFileSync(join(`${dir}/handlers`, 'package.json')),
        { mode: MODE_0666 },
      );
      mkdirSync(`${destinationPath}/contracts`);
      writeFileSync(
        join(`${destinationPath}/contracts`, 'example.sol'),
        readFileSync(join(`${dir}/contracts`, 'example.sol')),
        { mode: MODE_0666 },
      );
    }

    await this.config.runHook('analyticsSend', { command: 'init' });
    this.log(`${name} directory has been created.`);
  }
}
