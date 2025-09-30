import { IsEmail, IsString } from "class-validator";

export class LoginInputDTO {
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;

  constructor(params: { email: string; password: string }) {
    this.email = params.email;
    this.password = params.password;
  }
}
