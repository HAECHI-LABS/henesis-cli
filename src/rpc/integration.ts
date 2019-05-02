import { Integration } from '../types';
import { plainToClass } from 'class-transformer';
import wretch from 'wretch';

wretch().polyfills({
    fetch: require("node-fetch"),
    FormData: require("form-data"),
    URLSearchParams: require("url").URLSearchParams
});


export class IntegrationRpc {
  server: string;
  
  constructor(server: string) {
    this.server = server + '/integrations/v1';
  }
  
  /**
   * Gets a list of integrations.
   * @returns A list of integrations
   */
  public getIntegrationList(): Promise<Integration[]> {
    return new Promise((resolve, reject) => {
      wretch(this.server)
        .get()
        .json((json: any) => {
          if (Array.isArray(json)) {
            resolve(plainToClass(Integration, json));
          } else {
            reject(
              Error(
                `Expected getIntegrationsList to return an array but it returned ${json}`,
              ),
            );
          }
        })
        .catch(reject);
    });
  };
  
  /**
   * Get a integration.
   * @returns A integration
   */
  public getIntegration(integrationId: string): Promise<Integration> {
    return new Promise((resolve, reject) => {
      wretch(this.server + '/' + integrationId)
        .get()
        .json(json => resolve(plainToClass(Integration, json)))
        .catch(reject);
    });
  }
  
  /**
   * Patch a integration.
   * @returns A integration
   */
  public patchIntegration(integrationId: string, integration: Integration): Promise<Integration | null> {
    return new Promise((resolve, reject) => {
      wretch(this.server + '/' + integrationId)
        .patch(integration)
        .json(json => resolve(plainToClass(Integration, json)))
        .catch(reject);
    });
  }
  
  /**
   * Create a integration.
   * @returns A integration
   */
  public createIntegration(integration: Integration): Promise<Integration> {
    return new Promise((resolve, reject) => {
      wretch(this.server)
        .post(integration)
        .json(json => resolve(plainToClass(Integration, json)))
        .catch(reject);
    });
  }
  
  /**
   * Create a integration.
   * @returns A integration
   */
  public deleteIntegration(integrationId: string): Promise<null> {
    return new Promise((resolve, reject) => {
      wretch(this.server+"/"+integrationId)
        .delete()
        .text()
        .then(_ =>resolve(null))
        .catch(reject);
    });
  }
}
