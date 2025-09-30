import { Exception, ExceptionSeverity } from "@hex-lib/core";

export class AuthenticationException extends Exception {
  constructor(detail: string) {
    super({
      severity: ExceptionSeverity.ERROR,
      status: 401,
      code: "AUTHENTICATION_FAILED",
      detail,
    });
  }
}
