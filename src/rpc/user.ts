import { LoginRequest, LoginResponse, ChangePassword } from '../types';
import wretch from 'wretch';
import { plainToClass } from 'class-transformer';

export class UserRpc {
  private server: string;

  public constructor(host: string) {
    this.server = `${host}/users`;
  }

  public async login(email: string, password: string): Promise<LoginResponse> {
    const payload = new LoginRequest(email, password);

    const json = await wretch(`${this.server}/login`)
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

    await wretch(`${this.server}/passwd`)
      .patch(payload)
      .forbidden(
        (): Error => {
          throw new Error(`Unauthorization Token`);
        },
      )
      .error(
        412,
        (): Error => {
          throw new Error(`No satisfied conditions`);
        },
      )
      .json();
  }
}
