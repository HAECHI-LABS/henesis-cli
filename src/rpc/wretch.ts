import wretch, { Wretcher } from 'wretch';

let wretchInstance: Wretcher = wretch().polyfills({
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
