export { run } from '@oclif/command';
import wretch from 'wretch';

wretch().polyfills({
  fetch: require('node-fetch'),
  FormData: require('form-data'),
  URLSearchParams: require('url').URLSearchParams,
});
