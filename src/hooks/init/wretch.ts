import { Hook } from '@oclif/config';
import wretch from 'wretch';
import configstore from '../../common/configstore';
import { setWretcher } from '../../rpc/wretch';

// set for nodejs
const hook: Hook<'init'> = async function(opts) {
  const isExistUser = configstore.has('user');

  if (isExistUser) {
    const user = configstore.get('user');
    setWretcher(
      wretch()
        .polyfills({
          fetch: require('node-fetch'),
          FormData: require('form-data'),
          URLSearchParams: require('url').URLSearchParams,
        })
        .auth(`Bearer ${user.jwtToken}`)
        .catcher(401, () => {
          configstore.delete('user');
        }),
    );
  }
};

export default hook;
