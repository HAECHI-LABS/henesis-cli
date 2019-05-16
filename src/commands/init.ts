import { Command, flags } from '@oclif/command';
import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const TEMPLATE_DIR = join(__dirname, '..', '..', 'templates');
const MODE_0666 = parseInt('0666', 8);
const MODE_0755 = parseInt('0755', 8);

export default class Init extends Command {
  public static description = 'describe the command here';

  public static examples = [
    `$ cli init -n henesis
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
      join(`${destinationPath}/handler`, 'handler.ts'),
      readFileSync(join(`${TEMPLATE_DIR}/handler`, 'handler.ts')),
      { mode: MODE_0666 },
    );
    mkdirSync(`${destinationPath}/contract`);
    writeFileSync(
      join(`${destinationPath}/contract`, 'example.sol'),
      readFileSync(join(`${TEMPLATE_DIR}/contract`, 'example.sol')),
      { mode: MODE_0666 },
    );

    this.log(`${name} directory has been created.`);

    // writeFileSync(file, str, { mode: mode || MODE_0666 });

    // let files = readdirSync(destinationPath);
    // for (let f of files) {
    //   this.log(f);
    // }
    // const { args, flags } = this.parse(Init);
    // const name = flags.name || 'world';
    // this.log(`hello ${name} from ./src/commands/init.ts`);
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`);
    // }
  }
}
