import {
  Service,
  ServiceDecorator,
  type ServiceDependencies,
} from "@hex-lib/core";
import { LoginInputDTO } from "@/auth/application/dtos/login_input.dto";
import { LoginOutputDTO } from "@/auth/application/dtos/login_output.dto";
import { UserDynamoAdapter } from "@/auth/infrastructure/adapters/user_dynamo.adapter";
import { IUserRepositoryPort } from "@/auth/infrastructure/ports/user_repository.port";
import { UserNotFoundException } from "@/auth/application/exceptions/user_not_found.exception";
import { HashService } from "@/auth/application/services/hash.service";
import { JwtService } from "@/auth/application/services/jwt.service";

export interface AuthServiceDependencies extends Partial<ServiceDependencies> {
  ports: {
    userRepositoryPort: IUserRepositoryPort;
  };
  services: {
    hashService: HashService;
    jwtService: JwtService;
  };
}

const authServiceDependencies: AuthServiceDependencies = {
  ports: {
    userRepositoryPort: new UserDynamoAdapter(),
  },
  services: {
    hashService: new HashService(),
    jwtService: new JwtService(),
  },
};

@ServiceDecorator(authServiceDependencies)
export class AuthService extends Service<AuthServiceDependencies> {
  /**
   * Autenticar un usuario
   * @param credentials - Credenciales de usuario
   * @returns Token de autenticación
   */
  async authenticate(credentials: LoginInputDTO): Promise<LoginOutputDTO> {
    this.getLogger().info({
      message: "Iniciando autenticación de usuario",
      context: this.getContext(),
      metadata: { email: credentials.email },
    });

    const user = await this.getPort("userRepositoryPort").findByEmail(
      credentials.email
    );
    if (!user) {
      throw new UserNotFoundException(credentials.email);
    }
    const hashService = this.getService("hashService");
    const isPasswordValid = await hashService.compare(
      credentials.password,
      user.getPassword()
    );
    if (!isPasswordValid) {
      throw new UserNotFoundException(credentials.email);
    }
    const jwtService = this.getService("jwtService");
    const token = await jwtService.sign({
      id: user.getId().getValue(),
      email: user.getEmail(),
    });

    return {
      token,
      user: {
        id: user.getId().getValue(),
        email: user.getEmail(),
      },
      expiresIn: 3600,
    };
  }
}
