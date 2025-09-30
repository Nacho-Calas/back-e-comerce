import { Exception, ExceptionSeverity } from "@hex-lib/core";

export class ProductoNotFoundException extends Exception {
  constructor(id: string) {
    super({
      severity: ExceptionSeverity.ERROR,
      status: 404,
      code: "PRODUCTO_NOT_FOUND",
      detail: `Producto con ID ${id} no encontrado`,
      metadata: { id },
    });
  }
}
