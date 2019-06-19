import { Command, flags } from '@oclif/command';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import {
  Handler,
  HandlerSpec,
  Integration,
  IntegrationSpec,
  Webhook,
} from '../../types';
import integrationRpc from '../../rpc/integration';
import { CompileResult, compileSol, getLatestEvmVersion } from '../../compiler';
import { Status } from '../../types/Integration';
import { cli } from 'cli-ux';

const defaultSpecFile = './henesis.yaml';

async function getAbi(
  path: string,
  compilerVersion: string,
  contractName: string,
): Promise<any> {
  const result: CompileResult = await compileSol(path, {
    solcVersion: compilerVersion,
    evmVersion: getLatestEvmVersion(compilerVersion),
  });

  return result.getAbi(contractName);
}

async function toIntegration(spec: IntegrationSpec): Promise<Integration> {
  const abi: any = await getAbi(
    spec.contract.path,
    spec.contract.compilerVersion,
    spec.contract.name,
  );

  if (abi === undefined) {
    throw new Error(
      `corresponding contract name does not exist in '${
        spec.contract.path
      }' file`,
    );
  }

  function toHandler(name: string, handlerSpec: HandlerSpec): Handler {
    if (
      typeof handlerSpec.path === 'undefined' &&
      typeof handlerSpec.dep === 'undefined'
    ) {
      const code =
        "exports.template = (web3:any, event: any, blockMeta:any, userMeta:any): any => {\n  console.log('event', event.payload);\n  return event.payload;\n};\n";
      const dep =
        '{\n\t"name": "henesis",\n\t"version": "1.0.0",\n\t"description": "",\n\t"main": "index.js",\n\t"scripts": {\n\t\t"test": "echo \\"Error: no test specified\\" && exit 1"\n\t},\n\t"author": "",\n\t"license": "ISC"\n}\n';
      return new Handler(
        '',
        name,
        handlerSpec.event,
        'v1',
        code,
        dep,
        'tsnode8',
        'template',
      );
    }

    if (
      !fs.existsSync(handlerSpec.path as string) ||
      !fs.existsSync(handlerSpec.dep as string)
    ) {
      throw new Error(
        `${name} handler dependency file or code file does not exists`,
      );
    }

    const code = fs.readFileSync(handlerSpec.path as string, 'utf8');
    const dep = fs.readFileSync(handlerSpec.dep as string, 'utf8');

    return new Handler(
      '',
      name,
      handlerSpec.event,
      handlerSpec.version,
      code,
      dep,
      handlerSpec.runtime,
      handlerSpec.function,
    );
  }

  function toHandlers(handlerSpecs: { [key: string]: HandlerSpec }): Handler[] {
    const handlers = [];
    for (let name in handlerSpecs) {
      handlers.push(toHandler(name, handlerSpecs[name]));
    }
    return handlers;
  }

  const handlers: Handler[] = await toHandlers(spec.handlers);
  return new Integration(
    '',
    0,
    spec.name,
    spec.version,
    abi,
    spec.contract.address,
    spec.blockchain.platform,
    spec.blockchain.network,
    handlers,
    new Webhook(spec.webhook.url, spec.webhook.method, spec.webhook.headers),
    new Status(0, 'Unavailable'),
  );
}

export default class Deploy extends Command {
  public static description = 'deploy a integration';
  public static examples = [
    `$ henesis integration:deploy my-integration-id-xqxz`,
  ];
  public static flags = {
    help: flags.help({ char: 'h' }),
    path: flags.string({
      char: 'p',
      description: 'Set where henesis.yaml is located.',
      default: defaultSpecFile,
    }),
    force: flags.boolean({
      char: 'f',
      description:
        'Erase existing deployed content and deploy current configuration.',
      default: false,
    }),
  };
  public static args = [];

  public async run(): Promise<void> {
    const { flags } = this.parse(Deploy);
    try {
      const integrationSpec: IntegrationSpec = yaml.safeLoad(
        fs.readFileSync(flags.path || defaultSpecFile, 'utf8'),
      );

      cli.action.start('Starting deploy');

      await this.config.runHook('analyticsSend', {
        command: 'integration:deploy',
      });

      if (flags.force) {
        const integration = await integrationRpc.getIntegrationByName(
          integrationSpec.name,
        );
        await integrationRpc.updateIntegration(
          integration.integrationId,
          await toIntegration(integrationSpec),
        );
        this.log(`${integration.integrationId} has been deployed with force`);
      } else {
        const integration = await integrationRpc.createIntegration(
          await toIntegration(integrationSpec),
        );
        this.log(`${integration.integrationId} has been deployed`);
        return;
      }
    } catch (err) {
      await this.config.runHook('analyticsSend', { error: err });
      this.error(err.message, { exit: 1 });
    }
    cli.action.stop('✅');
  }
}
