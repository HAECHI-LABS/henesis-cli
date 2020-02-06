import { expect } from '@oclif/test';
import { baseUrl } from './url';
import configstore from '../common/configstore';

describe('Config', (): void => {
  it('should be returned if setted endpoint', (): void => {
    configstore.set('endpoint', 'https://henesis.io');
    process.env.HENESIS_TEST = 'false';
    const url = baseUrl();
    process.env.HENESIS_TEST = 'true';
    configstore.delete('endpoint');
    expect(url).to.equal('https://henesis.io');
  });

  it('should be returned test url on test', (): void => {
    const url = baseUrl();
    expect(url).to.equal('http://localhost:8080');
  });

  it('should be returned prod url on production', (): void => {
    process.env.HENESIS_TEST = 'false';
    const url = baseUrl();
    expect(url).to.equal('https://privatebeta.henesis.io');
    process.env.HENESIS_TEST = 'true';
  });
});
