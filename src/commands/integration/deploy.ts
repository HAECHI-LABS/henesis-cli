import { Command, flags } from '@oclif/command';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { Handler, HandlerSpec, Integration, IntegrationSpec, Subscriber, Webhook } from '../../types';
import integrationRpc from '../../rpc/integration';
import { CompileResult, compileSol, Option } from '../../compiler';

const defaultSpecFile = './spec.yaml';

export default class Deploy extends Command {
  public static description = 'deploy a integration';
  public static examples = [`$ ql-cli integration:delete`];
  public static flags = {
    file: flags.string({ char: 'f', default: defaultSpecFile }),
    update: flags.boolean({ char: 'u' }),
  };
  public static args = [];
  
  public async run() {
    const { flags } = this.parse(Deploy);
    try {
      const integrationSpec: IntegrationSpec = yaml.safeLoad(
        fs.readFileSync(flags.file || defaultSpecFile, 'utf8'),
      );
      
      if (flags.update) {
        const integration = await integrationRpc.getIntegrationByName(integrationSpec.name);
        await integrationRpc.updateIntegration(integration.integrationId, await toIntegration(integrationSpec));
        this.log(`${integration.integrationId} has been updated`);
      } else {
        const integration = await integrationRpc.createIntegration(await toIntegration(integrationSpec));
        this.log(`${integration.integrationId} has been deployed`);
        return;
      }
    } catch (e) {
      this.error(e, { exit: 1 });
    }
  }
}

async function getAbiString(path: string, compilerVersion: string, contractName: string): Promise<string> {
  const result: CompileResult = await compileSol(
    path,
    {
      solcVersion: compilerVersion,
      evmVersion: 'byzantium',
    } as Option,
  );
  
  return JSON.stringify(result.getAbi(contractName));
}

async function toHandlers(handlerSpecs: { [key: string]: HandlerSpec }): Promise<Handler[]> {
  const handlers = [];
  for (let name in handlerSpecs) {
    const code = fs.readFileSync(handlerSpecs[name].path, 'utf8');
    handlers.push(new Handler(
      '',
      name,
      handlerSpecs[name].event,
      handlerSpecs[name].version,
      code,
      handlerSpecs[name].runtime,
      handlerSpecs[name].function,
    ));
  }
  
  return handlers;
}

async function toIntegration(spec: IntegrationSpec): Promise<Integration> {
  const abiString: string = await getAbiString(spec.contract.path, spec.contract.compilerVersion, spec.contract.name);
  const handlers: Handler[] = await toHandlers(spec.handlers);
  return new Integration(
    '',
    0,
    spec.name,
    spec.version,
    new Subscriber(spec.network.endpoint, spec.contract.address, abiString, spec.network.type),
    handlers,
    new Webhook(spec.webhook.url, spec.webhook.method, spec.webhook.headers),
    '',
  );
}
