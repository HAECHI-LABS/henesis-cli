import { concatAndDeDuplicate } from './utils';
import first from './mock/abi/first.json';
import second from './mock/abi/second.json';
import third from './mock/abi/third.json';
import aggregated from './mock/abi/aggregated.json';
import { expect } from '@oclif/test';

describe('utils-test', (): void => {
  it('aggregate abis when the events of contract are separated in several files',
    async (): Promise<void> => {
    let aggregatedAbis: any[] = [];
    aggregatedAbis.push(first);
    aggregatedAbis.push(second);
    aggregatedAbis.push(third);

    const result = concatAndDeDuplicate(...aggregatedAbis);
    expect(result).to.deep.equal(aggregated);
  });
});
