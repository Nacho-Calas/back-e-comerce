import {
  Controller,
  AdapterDecorator,
  type AdapterDependencies,
} from "@hex-lib/core";
import { AuthService } from "@/auth/application/services/auth.service";
import { LoginInputDTO } from "@/auth/application/dtos/login_input.dto";
import { LoginOutputDTO } from "@/auth/application/dtos/login_output.dto";

export interface AuthControllerDependencies
  extends Partial<AdapterDependencies> {
  services: {
    authService: AuthService;
  };
}

const authControllerDependencies: AuthControllerDependencies = {
  services: {
    authService: new AuthService(),
  },
};

@AdapterDecorator(authControllerDependencies)
export class AuthController extends Controller<AuthControllerDependencies> {
  async authenticate(credentials: LoginInputDTO): Promise<LoginOutputDTO> {
    // Validar DTO de entrada
    this.getValidator().validate(credentials);

    this.getLogger().info({
      message: "Solicitud de autenticación recibida",
      context: this.getContext(),
      metadata: { email: credentials.email },
    });

    const authService = this.getService("authService");
    const result = await authService.authenticate(credentials);

    this.getLogger().info({
      message: "Autenticación procesada exitosamente",
      context: this.getContext(),
      metadata: { email: credentials.email },
    });

    return result;
  }
}
