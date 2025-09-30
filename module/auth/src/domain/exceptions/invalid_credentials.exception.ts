import { Exception, ExceptionSeverity } from "@hex-lib/core";

export class InvalidCredentialsException extends Exception {
  constructor(email: string) {
    super({
      severity: ExceptionSeverity.WARN,
      status: 401,
      code: "INVALID_CREDENTIALS",
      detail: `Credenciales inválidas para el usuario: ${email}`,
      metadata: {
        email,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
