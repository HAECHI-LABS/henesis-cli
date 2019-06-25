import { Integration } from '../types';
import { plainToClass } from 'class-transformer';
import { baseUrl, rpcVersion } from './config';
import { getWretcher } from './wretch';

export class IntegrationRpc {
  private server: string;

  public constructor(server: string, version: string) {
    this.server = server + '/integrations/' + version;
  }

  /**
   * Gets a list of integrations.
   * @returns A list of integrations
   */
  public async getIntegrations(): Promise<Integration[]> {
    const json = await getWretcher()
      .url(this.server)
      .get()
      .json()
      .catch((err: any) => {
        throw err;
      });

    if (!Array.isArray(json)) {
      throw new Error(
        `Expected getIntegrationsList to return an array but it returned ${json}`,
      );
    }

    return plainToClass(Integration, json);
  }

  /**
   * find a integrations by name.
   * @returns a integration
   */
  public async getIntegrationByName(name: string): Promise<Integration> {
    const json = await getWretcher()
      .url(this.server + '/findByName')
      .query({ name: name })
      .get()
      .json()
      .catch((err: any) => {
        throw err;
      });

    return plainToClass(Integration, json);
  }

  /**
   * Get a integration.
   * @returns A integration
   */
  public async getIntegration(integrationId: string): Promise<Integration> {
    const json = await getWretcher()
      .url(this.server + '/' + integrationId)
      .get()
      .json()
      .catch((err: any) => {
        throw err;
      });
    return plainToClass(Integration, json);
  }

  /**
   * Patch a integration.
   * @returns A integration
   */
  public async updateIntegration(
    integrationId: string,
    integration: Integration,
  ): Promise<Integration | null> {
    const json = await getWretcher()
      .url(this.server + '/' + integrationId)
      .put(integration)
      .json()
      .catch((err: any) => {
        throw err;
      });
    return plainToClass(Integration, json);
  }

  /**
   * Create a integration.
   * @returns A integration
   */
  public async createIntegration(
    integration: Integration,
  ): Promise<Integration> {
    const json = await getWretcher()
      .url(this.server)
      .post(integration)
      .json()
      .catch((err: any) => {
        throw err;
      });
    return plainToClass(Integration, json);
  }

  /**
   * Create a integration.
   * @returns A integration
   */
  public async deleteIntegration(integrationId: string): Promise<null> {
    await getWretcher()
      .url(this.server + '/' + integrationId)
      .delete()
      .text()
      .catch((err: any) => {
        throw err;
      });
    return null;
  }
}

// @ts-ignore
const url = baseUrl();
const integrationRpc = new IntegrationRpc(url, rpcVersion);
export default integrationRpc;
