import {
  compileSol,
  Option,
  CompileResult,
  CompiledContract,
  CompiledSource,
} from './solc';
import { expect } from '@oclif/test';
import { fancy } from 'fancy-test';

describe('solc', () => {
  describe('#compileSol()', () => {
    it('should compile solidity code', async () => {
      const path = __dirname + '/../../templates/contracts/example.sol';
      const result: CompileResult = await compileSol(path, {
        solcVersion: '0.5.8',
      } as Option);
      expect(result.contracts).to.not.equal(undefined);
      expect(result.sources).to.not.equal(undefined);
    }).timeout(10000);

    context('when file does not end with .sol', () => {
      fancy
        .do(async () => {
          const path = __dirname + '/../../templates/contract/example.notsol';
          await compileSol(path, { solcVersion: '0.4.12' } as Option);
        })
        .catch('it is not a solidity file.')
        .it('should throw not sol file error');
    });
  });

  describe('CompileResult', () => {
    let result: CompileResult;
    describe('#getAbi()', () => {
      const contractName = 'example';
      const abi = [{ abi: 'abi' }] as Record<string, any>[];
      beforeEach(() => {
        const contracts = {
          example: { abi: abi } as CompiledContract,
        };
        const sources = {
          example: {} as CompiledSource,
        };
        result = new CompileResult(contracts, sources);
      });
      it('should get abi', () => {
        expect(result.getAbi(contractName)).to.deep.equal(abi);
      });
    });
  });
});
