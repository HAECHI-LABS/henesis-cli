import { flags } from '@oclif/command';
import {
  existsSync,
  copyFileSync,
  mkdirSync,
  constants,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import Command from '../common/base';
import simplegit from 'simple-git/promise';

const TEMPLATE_DIR = join(__dirname, '..', '..', 'templates');

export default class Init extends Command {
  public static description =
    'set up configuration file required for your project';

  public static examples = [
    `$ henesis init
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
      description: 'Delete existing configuration file and create new one.',
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
    insideDir: boolean,
  ): Promise<void> {
    await this.initConfiguration(destinationPath, withForce);

    if (!insideDir) {
      if (!existsSync(`${destinationPath}/contracts`)) {
        mkdirSync(`${destinationPath}/contracts`);
      }

      writeFileSync(
        join(`${destinationPath}/contracts`, 'example.sol'),
        withForce ? constants.COPYFILE_FICLONE : undefined,
      );
    }
  }

  private async initConfiguration(
    destinationPath: string,
    withForce: boolean | undefined = false,
  ): Promise<void> {
    copyFileSync(
      join(`${TEMPLATE_DIR}`, 'henesis.yaml'),
      join(`${destinationPath}`, 'henesis.yaml'),
      withForce ? constants.COPYFILE_FICLONE : undefined,
    );
  }

  private async gitInit(url: string, destinationPath: string): Promise<void> {
    await simplegit().clone(url, destinationPath);
  }

  private setDirectoryName(currentPath: string, flags: any): string {
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

    return `${currentPath}/${name}`;
  }

  public async run(): Promise<void> {
    const currentPath = process.cwd() || '.';
    const contractsPath = `${currentPath}/contracts`;
    const { flags } = this.parse(Init);

    if (existsSync(contractsPath)) {
      if (existsSync(`${currentPath}/henesis.yaml`) && flags.force === false) {
        this.error(
          `The henesis.yaml configuration file already exists at the current path.`,
          { code: '361' },
        );
      }

      await this.initTemplate(currentPath, flags.force, true);
    } else {
      const destinationPath = this.setDirectoryName(currentPath, flags);

      if (existsSync(destinationPath) && flags.force === false) {
        this.error(
          `The henesis directory already exists at the current path.`,
          { code: '362' },
        );
      }

      if (!existsSync(destinationPath)) {
        mkdirSync(`${destinationPath}`);
      }

      if (typeof flags.git !== 'undefined') {
        await this.gitInit(flags.git, destinationPath);
      } else {
        await this.initTemplate(destinationPath, flags.force, false);
      }
    }
    this.log(`henesis initialization has been completed.`);
  }
}
