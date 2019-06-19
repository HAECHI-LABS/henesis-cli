import * as fs from 'fs';
import * as path from 'path';

declare var require: (moduleId: string) => any;
const findNodeModules = require('find-node-modules');
const CompilerSupplier = require('./compilerSupplier');

export interface Option {
  evmVersion: string;
  solcVersion: string;
  optimizer?: Optimizer;
}

export interface Optimizer {
  enable: boolean;
  runs: number;
}

export interface CompiledOutputs {
  contracts: {
    [file: string]: {
      [contract: string]: CompiledContract;
    };
  };
  sources: {
    [file: string]: {
      [contract: string]: CompiledSource;
    };
  };
  errors: CompiledError[];
}

export interface CompiledContract {
  abi: Record<string, any>[];
  devdoc: Record<string, any>;
  evm: Record<string, any>;
  metadata: string;
  userdoc: Record<string, any>;
}

export interface CompiledSource {
  ast: Record<string, any>;
  legacyAST: Record<string, any>;
  id: number;
}

export interface CompiledError {
  component: string;
  formattedMessage: string;
  message: string;
  severity: string;
  type: string;
}

export class CompileResult {
  public constructor(
    public contracts: {
      [contract: string]: CompiledContract;
    },
    public sources: {
      [contract: string]: CompiledSource;
    },
  ) {}

  public getAbi(contractName: string): any {
    if (typeof this.contracts[contractName] === 'undefined') {
      return undefined;
    }
    return this.contracts[contractName].abi;
  }
}

function findImportPath(filePath: string) {
  // find recursively to find .sol file
  if (fs.existsSync(filePath)) {
    return filePath;
  } else {
    // find .sol file from node_modules
    const nodeModules = findNodeModules();
    for (let nodeModule of nodeModules) {
      const modulePath = path.join(nodeModule, filePath);
      if (fs.existsSync(modulePath)) return modulePath;
    }
    throw new Error(`Module path, ${filePath} is not found`);
  }
}

function findImports(filePath: string) {
  return {
    contents: fs.readFileSync(findImportPath(filePath), 'utf8'),
  };
}

async function getSolc(version: string): Promise<any> {
  const supplier = new CompilerSupplier({
    version: version,
  });
  return supplier.load();
}

export function getLatestEvmVersion(compilerVersion: string): string {
  let evmVersion = '';
  const rawVersions: string[] = compilerVersion.split('.');

  const versions: number[] = [
    parseInt(rawVersions[0]),
    parseInt(rawVersions[1]),
    parseInt(rawVersions[2].split('-')[0]),
  ];

  // <= 0.5.4: byzantium
  if ((versions[1] === 5 && versions[2] <= 4) || versions[1] < 5) {
    evmVersion = 'byzantium';
  } else {
    evmVersion = 'petersburg';
  }

  return evmVersion;
}

const compile = async (
  source: { [x: string]: { content: string } },
  option: Option,
): Promise<CompiledOutputs> => {
  const solc = await getSolc(option.solcVersion);
  return JSON.parse(
    solc.compile(
      JSON.stringify({
        language: 'Solidity',
        sources: source,
        settings: {
          evmVersion: option.evmVersion,
          optimizer: option.optimizer,
          outputSelection: {
            '*': {
              '*': ['*'],
            },
          },
        },
      }),
      findImports,
    ),
  );
};

export const compileSol = async (
  file: string,
  option: Option,
): Promise<CompileResult> => {
  if (!file.endsWith('.sol')) {
    throw new Error('it is not a solidity file.');
  }

  const output = await compile(
    Object.assign(
      {},
      {
        [file]: { content: fs.readFileSync(file, 'utf8') },
      },
    ),
    option,
  );

  if (output.errors) {
    let errMsg = '';
    for (let i = 0; i < output.errors.length; i++) {
      if (output.errors[i].severity === 'warning') {
        continue;
      }
      errMsg = errMsg + (output.errors[i].message + '\n');
    }

    if (errMsg !== '') {
      throw new Error(`Compilation Error! ${errMsg}`);
    }
  }

  return new CompileResult(output.contracts[file], output.sources[file]);
};
