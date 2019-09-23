import 'reflect-metadata';

export class LoginRequest {
  public email: string;
  private password: string;

  public constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class LoginResponse {
  public email: string;
  public name: string;
  public organization: string;
  public jwtToken: string;

  public constructor(
    email: string,
    name: string,
    organization: string,
    jwtToken: string,
  ) {
    this.email = email;
    this.name = name;
    this.organization = organization;
    this.jwtToken = jwtToken;
  }
}

export class ChangePassword {
  private password: string;
  private newPassword: string;

  public constructor(password: string, newPassword: string) {
    this.password = password;
    this.newPassword = newPassword;
  }
}

export class DescribeResponse {
  public email: string;
  public name: string;
  public organization: string;
  public clientId: string;

  public constructor(
    email: string,
    name: string,
    organization: string,
    clientId: string,
  ) {
    this.email = email;
    this.name = name;
    this.organization = organization;
    this.clientId = clientId;
  }
}
