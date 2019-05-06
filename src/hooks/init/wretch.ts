import { Hook } from '@oclif/config';
import wretch from 'wretch';

// set for nodejs
const hook: Hook<'init'> = async function(opts) {
  wretch().polyfills({
    fetch: require('node-fetch'),
    FormData: require('form-data'),
    URLSearchParams: require('url').URLSearchParams,
  });
};

export default hook;
