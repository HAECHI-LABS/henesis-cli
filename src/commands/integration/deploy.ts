import { flags } from '@oclif/command';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import {
  Integration,
  IntegrationSpec,
  UpdateIntegrationRequest,
} from '../../types';
import integrationRpc from '../../rpc/integration';
import { CompileResult, compileSol, getLatestEvmVersion } from '../../compiler';
import {
  Blockchain,
  Contract,
  CreateIntegrationRequest,
  Filter,
  Provider,
} from '../../types';
import { startWait, endWait } from '../../utils';
import Command from '../../common/base';
import { ContractSpec } from '../../types/IntegrationSpec';
import { Hook } from '@oclif/config';
import Update = Hook.Update;

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

async function toContract(contractSpec: ContractSpec): Promise<Contract> {
  const abi: any = await getAbi(
    contractSpec.path,
    contractSpec.compilerVersion,
    contractSpec.name,
  );

  startWait('Deploying');

  if (abi === undefined) {
    throw new Error(
      `corresponding contract name does not exist in '${contractSpec.path}' file`,
    );
  }

  return new Contract(contractSpec.name, contractSpec.address, abi);
}

async function toContracts(contractSpecs: ContractSpec[]): Promise<Contract[]> {
  let contracts: Contract[] = [];
  for (let i = 0; i < contractSpecs.length; i++) {
    contracts.push(await toContract(contractSpecs[i]));
  }
  return contracts;
}

async function toCreateIntegrationRequest(
  spec: IntegrationSpec,
): Promise<CreateIntegrationRequest> {
  const contracts: Contract[] = await toContracts(spec.filters.contracts);
  return new CreateIntegrationRequest(
    spec.name,
    spec.version,
    new Blockchain(
      spec.blockchain.platform,
      spec.blockchain.network,
      spec.blockchain.interval,
      spec.blockchain.threshold,
    ),
    new Filter(contracts),
    new Provider(
      spec.provider.type,
      spec.provider.connectionLimit,
      spec.provider.url,
      spec.provider.method,
      spec.provider.retry,
      spec.provider.headers,
    ),
  );
}

async function toUpdateIntegrationRequest(
  spec: IntegrationSpec,
): Promise<UpdateIntegrationRequest> {
  const contracts: Contract[] = await toContracts(spec.filters.contracts);
  return new UpdateIntegrationRequest(
    spec.version,
    new Blockchain(
      spec.blockchain.platform,
      spec.blockchain.network,
      spec.blockchain.interval,
      spec.blockchain.threshold,
    ),
    new Filter(contracts),
    new Provider(
      spec.provider.type,
      spec.provider.connectionLimit,
      spec.provider.url,
      spec.provider.method,
      spec.provider.retry,
      spec.provider.headers,
    ),
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

      if (flags.force) {
        const integration = await integrationRpc.getIntegrationByName(
          integrationSpec.name,
        );
        await integrationRpc.updateIntegration(
          integration.integrationId,
          await toUpdateIntegrationRequest(integrationSpec),
        );
        this.log(`${integration.integrationId} has been deployed with force`);
        endWait();
      } else {
        const integration: Integration = await integrationRpc.createIntegration(
          await toCreateIntegrationRequest(integrationSpec),
        );
        this.log(`${integration.integrationId} has been deployed`);
        endWait();
        return;
      }
    } catch (err) {
      this.error(err.message);
    }
  }
}
