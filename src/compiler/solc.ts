import * as fs from 'fs';
import * as path from 'path';

const findNodeModules = require('find-node-modules');
const CompilerSupplier = require('./compilerSupplier');
declare var require: (moduleId: string) => any;

export interface Option {
  evmVersion: string;
  solcVersion: string;
  optimizer: Optimizer;
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
  errors: CompiledError[]
}

export interface CompiledContract {
  abi: Object[];
  devdoc: Object;
  evm: Object;
  metadata: string;
  userdoc: Object;
}

export interface CompiledSource {
  ast: Object;
  legacyAST: Object;
  id: number;
}

export interface CompiledError{
  component: string,
  formattedMessage: string,
  message: string,
  severity: string,
  type: string
}

export class CompileResult {
  constructor(
    public contracts: {
      [contract: string]: CompiledContract;
    },
    public sources: {
      [contract: string]: CompiledSource;
    },
  ) {}

  public getAbi(contractName: string): any {
    return this.contracts[contractName].abi;
  }
}

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

  if (output.errors){
    let errMsg = '';
    for (let i = 0; i < output.errors.length; i++) {
      errMsg = errMsg + (output.errors[i].message + "\n");
    }
    throw new Error(`Compilation Error! ${errMsg}`);
  }

  return new CompileResult(output.contracts[file], output.sources[file]);
};

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

function findImports(filePath: string) {
  return {
    contents: fs.readFileSync(findImportPath(filePath), 'utf8'),
  };
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

async function getSolc(version: string): Promise<any> {
  const supplier = new CompilerSupplier({
    version: version,
  });
  return supplier.load();
}
