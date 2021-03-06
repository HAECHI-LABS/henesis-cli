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
import { startWait, endWait, concatAndDeDuplicate } from '../../utils';
import Command from '../../common/base';
import { ContractFileSpec, ContractSpec } from '../../types/IntegrationSpec';

const defaultSpecFile = './henesis.yaml';

async function detectErrors(
  error: any,
  path: string,
  compilerVersion: string,
  contractName: string,
): Promise<string> {
  if (
    error.message &&
    error.message.includes('requires different compiler version')
  ) {
    const rawError = error.message
      .split('less than the released version')[1]
      .trimEnd();
    return `Compile Error: The henesis is currently using solc '${compilerVersion}',
        but your '${contractName}.sol' contract uses different version.
        ${rawError}`;
  } else if (
    error.message &&
    error.message.includes('ENOENT: no such file or directory')
  ) {
    const errorFile = error.message.split("'")[1];
    return `No such file or directory: '${errorFile}`;
  } else {
    return `compile error: failed to compile '${path}' file.
       make sure you are at the correct compiler version or solidity file`;
  }
}

async function getAbi(
  path: string,
  compilerVersion: string,
  contractName: string,
): Promise<any> {
  let result: CompileResult;
  try {
    result = await compileSol(path, {
      solcVersion: compilerVersion,
      evmVersion: getLatestEvmVersion(compilerVersion),
    });
  } catch (error) {
    const message = await detectErrors(
      error,
      path,
      compilerVersion,
      contractName,
    );
    throw new Error(message);
  }

  return result.getAbi(contractName);
}

async function toContractFile(
  contractFileSpec: ContractFileSpec,
): Promise<any> {
  const abi: any = await getAbi(
    contractFileSpec.path,
    contractFileSpec.compilerVersion,
    contractFileSpec.contractName,
  );

  if (abi === undefined) {
    throw new Error(
      `Your filtered contract does not exist in '${contractFileSpec.path}' file`,
    );
  }

  return abi;
}

export async function toContract(
  contractSpec: ContractSpec,
): Promise<Contract> {
  startWait('Deploying');

  if (contractSpec.files === undefined) {
    throw new Error(
      `You need to update henesis.yaml schema. Please refer to https://docs.henesis.io/ or run 'henesis init' again for the new schema`,
    );
  }

  const abi: any[] = concatAndDeDuplicate(
    ...(await Promise.all(
      contractSpec.files.map(async c => await toContractFile(c)),
    )),
  );

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
  if ('timeout' in spec.provider) {
    throw new Error(
      `The timeout value is deprecated. Please refer to https://docs.henesis.io/`,
    );
  }
  return new CreateIntegrationRequest(
    spec.name,
    spec.version,
    spec.apiVersion,
    new Blockchain(
      spec.blockchain.platform,
      spec.blockchain.network,
      spec.blockchain.threshold,
    ),
    new Filter(contracts),
    new Provider(
      spec.provider.type,
      spec.provider.url,
      spec.provider.method,
      spec.provider.headers,
    ),
  );
}

async function toUpdateIntegrationRequest(
  spec: IntegrationSpec,
): Promise<UpdateIntegrationRequest> {
  const contracts: Contract[] = await toContracts(spec.filters.contracts);
  if ('timeout' in spec.provider) {
    throw new Error(
      `The timeout value is deprecated. Please refer to https://docs.henesis.io/`,
    );
  }
  return new UpdateIntegrationRequest(
    spec.version,
    spec.apiVersion,
    new Blockchain(
      spec.blockchain.platform,
      spec.blockchain.network,
      spec.blockchain.threshold,
    ),
    new Filter(contracts),
    new Provider(
      spec.provider.type,
      spec.provider.url,
      spec.provider.method,
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
      //TODO: suggestion to remove > by replacing this.error with console.error
      this.error(err.message);
    }
  }
}
