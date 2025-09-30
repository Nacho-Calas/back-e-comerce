import { Exception, ExceptionSeverity } from "@hex-lib/core";

export class StockInsuficienteException extends Exception {
  constructor(
    productoId: string,
    cantidadSolicitada: number,
    stockDisponible: number
  ) {
    super({
      severity: ExceptionSeverity.WARN,
      status: 400,
      code: "STOCK_INSUFICIENTE",
      detail: `Stock insuficiente para el producto ${productoId}. Solicitado: ${cantidadSolicitada}, Disponible: ${stockDisponible}`,
      metadata: {
        productoId,
        cantidadSolicitada,
        stockDisponible,
      },
    });
  }
}
