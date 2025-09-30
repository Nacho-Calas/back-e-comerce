import { Exception, ExceptionSeverity } from "@hex-lib/core";

export class CarritoNotFoundException extends Exception {
  constructor(id: string) {
    super({
      severity: ExceptionSeverity.ERROR,
      status: 404,
      code: "CARRITO_NOT_FOUND",
      detail: `Carrito con ID ${id} no encontrado`,
      metadata: { id },
    });
  }
}
