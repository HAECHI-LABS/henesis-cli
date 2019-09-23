import {
  LoginRequest,
  LoginResponse,
  ChangePassword,
  DescribeResponse,
} from '../types';
import { plainToClass } from 'class-transformer';
import { baseUrl, rpcVersion } from './config';
import { getWretcher } from './wretch';

export class UserRpc {
  private server: string;

  public constructor(host: string, version: string) {
    this.server = `${host}/users/${version}`;
  }

  public async login(email: string, password: string): Promise<LoginResponse> {
    const payload = new LoginRequest(email, password);

    const json = await getWretcher()
      .url(`${this.server}/login`)
      .post(payload)
      .error(
        403,
        (): Error => {
          throw new Error(`login failed`);
        },
      )
      .json();

    return plainToClass(LoginResponse, json) as LoginResponse;
  }

  public async changePassword(
    password: string,
    newPassword: string,
  ): Promise<void> {
    const payload = new ChangePassword(password, newPassword);

    await getWretcher()
      .url(`${this.server}/passwd`)
      .patch(payload)
      .error(
        403,
        (): Error => {
          throw new Error(`failed to change password`);
        },
      )
      .json()
      .catch((err: any) => {
        throw err;
      });
  }

  public async describe(): Promise<DescribeResponse> {
    const json = await getWretcher()
      .url(`${this.server}/me`)
      .get()
      .json()
      .catch((err: any) => {
        throw err;
      });

    return plainToClass(DescribeResponse, json) as DescribeResponse;
  }
}

const url = baseUrl();
export default new UserRpc(url, rpcVersion);
