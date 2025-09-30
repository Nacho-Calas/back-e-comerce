export class LoginOutputDTO {
  public readonly token: string;
  public readonly user: {
    id: string;
    email: string;
  };
  public readonly expiresIn: number;

  constructor(params: LoginOutputDTO) {
    this.token = params.token;
    this.user = params.user;
    this.expiresIn = params.expiresIn;
  }
}
