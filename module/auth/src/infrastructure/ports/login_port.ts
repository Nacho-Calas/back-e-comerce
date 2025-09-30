import { IPort } from "@hex-lib/core";
import { LoginInputDTO } from "@/auth/src/application/dtos/login_input.dto";
import { LoginOutputDTO } from "@/auth/src/application/dtos/login_output.dto";

export interface IAuthPort extends IPort {
  authenticate(credentials: LoginInputDTO): Promise<LoginOutputDTO>;
}
