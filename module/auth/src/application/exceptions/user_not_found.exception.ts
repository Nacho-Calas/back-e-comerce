import { Exception, ExceptionSeverity } from "@hex-lib/core";

export class UserNotFoundException extends Exception {
  constructor(email: string) {
    super({
      severity: ExceptionSeverity.ERROR,
      status: 404,
      code: "USER_NOT_FOUND",
      detail: `Usuario con email ${email} no encontrado`,
    });
  }
}
