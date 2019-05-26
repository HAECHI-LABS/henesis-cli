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
import { CompileResult, compileSol } from '../../compiler';

const defaultSpecFile = './henesis.yaml';

async function toIntegration(spec: IntegrationSpec): Promise<Integration> {
  const abi: any = await getAbi(
    spec.contract.path,
    spec.contract.compilerVersion,
    spec.contract.name,
  );
  
  if (abi === undefined){
    throw new Error(`corresponding contract name does not exist in '${spec.contract.path}' file`);
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
    '',
  );
}

async function getAbi(
  path: string,
  compilerVersion: string,
  contractName: string,
): Promise<any> {
  const result: CompileResult = await compileSol(path, {
    solcVersion: compilerVersion,
    evmVersion: 'byzantium',
  });
  
  return result.getAbi(contractName);
}

function toHandlers(handlerSpecs: {
  [key: string]: HandlerSpec;
}): Handler[] {
  const handlers = [];
  for (let name in handlerSpecs) {
    handlers.push(toHandler(name, handlerSpecs[name]));
  }
  return handlers;
}

function toHandler(name: string, handlerSpec: HandlerSpec): Handler {
  if (!fs.existsSync(handlerSpec.path) || !fs.existsSync(handlerSpec.dep)) {
    throw new Error(`${name} handler dependency file or code file does not exists`);
  }
  
  const code = fs.readFileSync(handlerSpec.path, 'utf8');
  const dep = fs.readFileSync(handlerSpec.dep, 'utf8');
  
  return new Handler(
    '',
    name,
    handlerSpec.event,
    handlerSpec.version,
    code,
    dep,
    handlerSpec.runtime,
    handlerSpec.function,
  )
}

export default class Deploy extends Command {
  public static description = 'deploy a integration';
  public static examples = [`$ henesis integration:deploy`];
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
      
      await this.config.runHook('analyticsSend', {
        command: 'integration:deploy',
      });
      
      if (flags.update) {
        const integration = await integrationRpc.getIntegrationByName(
          integrationSpec.name,
        );
        await integrationRpc.updateIntegration(
          integration.integrationId,
          await toIntegration(integrationSpec),
        );
        this.log(`${integration.integrationId} has been updated`);
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
  }
}
