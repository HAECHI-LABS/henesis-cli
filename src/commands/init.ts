import { Command, flags } from '@oclif/command';
import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const TEMPLATE_DIR = join(__dirname, '..', '..', 'templates');
const TEMPLATE_ERC20_DIR = join(__dirname, '..', '..', 'templates20');
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
      mkdirSync(`${destinationPath}/handler`);
      writeFileSync(
        join(`${destinationPath}/handler`, 'ERC20-approval.ts'),
        readFileSync(join(`${dir}/handler`, 'ERC20-approval.ts')),
        { mode: MODE_0666 },
      );
      writeFileSync(
        join(`${destinationPath}/handler`, 'ERC20-transfer.ts'),
        readFileSync(join(`${dir}/handler`, 'ERC20-transfer.ts')),
        { mode: MODE_0666 },
      );
      writeFileSync(
        join(`${destinationPath}/handler`, 'package.json'),
        readFileSync(join(`${dir}/handler`, 'package.json')),
        { mode: MODE_0666 },
      );
      mkdirSync(`${destinationPath}/contract`);
      writeFileSync(
        join(`${destinationPath}/contract`, 'ERC20.sol'),
        readFileSync(join(`${dir}/contract`, 'ERC20.sol')),
        { mode: MODE_0666 },
      );
    } else {
      mkdirSync(`${destinationPath}/handler`);
      writeFileSync(
        join(`${destinationPath}/handler`, 'execution.ts'),
        readFileSync(join(`${dir}/handler`, 'execution.ts')),
        { mode: MODE_0666 },
      );
      writeFileSync(
        join(`${destinationPath}/handler`, 'execution2.ts'),
        readFileSync(join(`${dir}/handler`, 'execution2.ts')),
        { mode: MODE_0666 },
      );
      writeFileSync(
        join(`${destinationPath}/handler`, 'package.json'),
        readFileSync(join(`${dir}/handler`, 'package.json')),
        { mode: MODE_0666 },
      );
      mkdirSync(`${destinationPath}/contract`);
      writeFileSync(
        join(`${destinationPath}/contract`, 'example.sol'),
        readFileSync(join(`${dir}/contract`, 'example.sol')),
        { mode: MODE_0666 },
      );
    }

    await this.config.runHook('analyticsSend', { command: 'init' });
    this.log(`${name} directory has been created.`);
  }
}
