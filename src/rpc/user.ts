import { LoginRequest, LoginResponse, ChangePassword } from '../types';
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
      .unauthorized(
        (): Error => {
          throw new Error(`Unauthenticated User`);
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
      .unauthorized(
        (): Error => {
          throw new Error(`Unauthenticated Token`);
        },
      )
      .forbidden(
        (): Error => {
          throw new Error(`No satisfied conditions`);
        },
      )
      .json();
  }
}

const url = baseUrl();
export default new UserRpc(url, rpcVersion);
