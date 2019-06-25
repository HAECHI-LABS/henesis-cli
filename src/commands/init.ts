import { flags } from '@oclif/command';
import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import Command from './base';
import * as simplegit from 'simple-git/promise';

const TEMPLATE_DIR = join(__dirname, '..', '..', 'templates');
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
    }),
    // flag with no value (-f, --force)
    force: flags.boolean({
      char: 'f',
      description: 'Delete existing folders and create new ones.',
      default: false,
    }),
    git: flags.string({
      char: 'g',
      description:
        'Generates a template through the passed git address. required git client',
    }),
  };

  public static args = [];

  public async run(): Promise<void> {
    const currentPath = process.cwd() || '.';
    const { flags } = this.parse(Init);
    let name;

    if (typeof flags.git !== 'undefined') {
      const words = flags.git.split('/').reverse();
      name = words[0].replace(/.git/gi, '');
    } else if (typeof flags.name !== 'undefined') {
      name = flags.name;
    } else if (
      typeof flags.name === 'undefined' &&
      typeof flags.git === 'undefined'
    ) {
      name = 'henesis';
    }

    const destinationPath = `${currentPath}/${name}`;

    if (existsSync(destinationPath) && flags.force === false) {
      this.error(`The directory exists at the current directory.`);
    }

    if (typeof flags.git !== 'undefined') {
      const git = simplegit();
      mkdirSync(`${destinationPath}`);
      await git.clone(flags.git as string, destinationPath);
    } else {
      mkdirSync(`${destinationPath}`);
      writeFileSync(
        join(`${destinationPath}`, 'henesis.yaml'),
        readFileSync(join(`${TEMPLATE_DIR}`, 'henesis.yaml')),
        {
          mode: MODE_0666,
        },
      );

      // TODO: with force.
      mkdirSync(`${destinationPath}/handlers`);
      writeFileSync(
        join(`${destinationPath}/handlers`, 'execution.ts'),
        readFileSync(join(`${TEMPLATE_DIR}/handlers`, 'execution.ts')),
        { mode: MODE_0666 },
      );
      writeFileSync(
        join(`${destinationPath}/handlers`, 'execution2.ts'),
        readFileSync(join(`${TEMPLATE_DIR}/handlers`, 'execution2.ts')),
        { mode: MODE_0666 },
      );
      writeFileSync(
        join(`${destinationPath}/handlers`, 'package.json'),
        readFileSync(join(`${TEMPLATE_DIR}/handlers`, 'package.json')),
        { mode: MODE_0666 },
      );
      mkdirSync(`${destinationPath}/contracts`);
      writeFileSync(
        join(`${destinationPath}/contracts`, 'example.sol'),
        readFileSync(join(`${TEMPLATE_DIR}/contracts`, 'example.sol')),
        { mode: MODE_0666 },
      );
    }

    this.log(`${name} directory has been created.`);
  }
}
