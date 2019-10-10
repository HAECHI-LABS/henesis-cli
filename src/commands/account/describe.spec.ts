import { expect, test } from '@oclif/test';
import * as utils from '../../utils';
import configstore from '../../common/configstore';
import { Scope } from 'nock';

describe('account:describe', (): void => {
  context(
    'error occurred cases',
    async (): Promise<void> => {
      test
        .stdout()
        .command(['account:describe'])
        .it('should be fail not logged in');
    },
  );
});
