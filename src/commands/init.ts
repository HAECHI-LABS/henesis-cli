import { flags } from '@oclif/command';
import {
  existsSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  constants,
} from 'fs';
import { join } from 'path';
import Command from '../common/base';
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

  private async initTemplate(
    destinationPath: string,
    withForce: boolean | undefined = false,
  ): Promise<void> {
    copyFileSync(
      join(`${TEMPLATE_DIR}`, 'henesis.yaml'),
      join(`${destinationPath}`, 'henesis.yaml'),
      withForce ? constants.COPYFILE_FICLONE : undefined,
    );

    if (!existsSync(`${destinationPath}/handlers`)) {
      mkdirSync(`${destinationPath}/handlers`);
    }

    copyFileSync(
      join(`${TEMPLATE_DIR}/handlers`, 'execution.ts'),
      join(`${destinationPath}/handlers`, 'execution.ts'),
      withForce ? constants.COPYFILE_FICLONE : undefined,
    );

    copyFileSync(
      join(`${TEMPLATE_DIR}/handlers`, 'execution2.ts'),
      join(`${destinationPath}/handlers`, 'execution2.ts'),
      withForce ? constants.COPYFILE_FICLONE : undefined,
    );

    copyFileSync(
      join(`${TEMPLATE_DIR}/handlers`, 'package.json'),
      join(`${destinationPath}/handlers`, 'package.json'),
      withForce ? constants.COPYFILE_FICLONE : undefined,
    );

    if (!existsSync(`${destinationPath}/contracts`)) {
      mkdirSync(`${destinationPath}/contracts`);
    }

    copyFileSync(
      join(`${TEMPLATE_DIR}/contracts`, 'example.sol'),
      join(`${destinationPath}/contracts`, 'example.sol'),
      withForce ? constants.COPYFILE_FICLONE : undefined,
    );
  }

  private async gitInit(url: string, destinationPath: string): Promise<void> {
    await simplegit().clone(url, destinationPath);
  }

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

    if (!existsSync(destinationPath)) {
      mkdirSync(`${destinationPath}`);
    }

    if (typeof flags.git !== 'undefined') {
      await this.gitInit(flags.git, destinationPath);
    } else {
      await this.initTemplate(destinationPath, flags.force);
    }

    this.log(`${name} directory has been created.`);
  }
}
