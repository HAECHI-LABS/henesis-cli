import { Hook } from '@oclif/config';
import configstore from '../../common/configstore';
import { getWretcher, setWretcher } from '../../rpc/wretch';

// set for nodejs
const hook: Hook<'init'> = async function(opts) {
  const isExistUser = configstore.has('user');
  if (isExistUser) {
    const user = configstore.get('user');
    setWretcher(
      getWretcher()
        .auth(`Bearer ${user.jwtToken}`)
        .catcher(401, () => {
          configstore.delete('user');
          throw new Error('expired token (please log in again)');
        }),
    );
  }
};

export default hook;
