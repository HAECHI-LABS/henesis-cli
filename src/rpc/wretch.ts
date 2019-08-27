import wretch, { Wretcher, WretcherError } from 'wretch';
import configstore from '../common/configstore';

const defaultErrorCatcher = (
  error: WretcherError,
  originalRequest: Wretcher,
): any => {
  if (error.json === undefined || error.json.error === undefined) {
    throw new Error('invalid response format');
  }
  throw new Error(error.json.error.message);
};

let wretchInstance: Wretcher = wretch()
  .errorType('json')
  .catcher(400, defaultErrorCatcher)
  .catcher(404, defaultErrorCatcher)
  .catcher(500, defaultErrorCatcher)
  .catcher(401, () => {
    configstore.delete('user');
    throw new Error('invalid or expired token (please log in again)');
  })
  .polyfills({
    fetch: require('node-fetch'),
    FormData: require('form-data'),
    URLSearchParams: require('url').URLSearchParams,
  });

export const setWretcher = (wretcher: Wretcher): void => {
  wretchInstance = wretcher;
};

export const getWretcher = (): Wretcher => {
  return wretchInstance;
};
