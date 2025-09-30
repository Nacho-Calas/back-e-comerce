/**
 * Helper para extraer el último error del stack de errores anidados
 */

export interface ErrorResponse {
  message: string;
  code?: string;
  statusCode: number;
  details?: any;
}

/**
 * Extrae el último error del stack de errores anidados
 * @param exceptions Array de excepciones del ExceptionManager
 * @returns El último error del stack con información relevante
 */
export function extractLastError(exceptions: any[]): ErrorResponse {
  if (!exceptions || exceptions.length === 0) {
    return {
      message: "Error desconocido",
      statusCode: 500,
    };
  }

  // Obtener el último error del array
  const lastError = exceptions[exceptions.length - 1];

  // Si el error tiene una estructura anidada, extraer el mensaje más específico
  if (lastError && typeof lastError === "object") {
    // Buscar el mensaje en diferentes propiedades posibles
    const message =
      lastError.message ||
      lastError.error?.message ||
      lastError.details?.message ||
      lastError.toString();

    // Buscar el código de error
    const code =
      lastError.code || lastError.error?.code || lastError.details?.code;

    // Buscar el status code
    const statusCode =
      lastError.statusCode ||
      lastError.error?.statusCode ||
      lastError.details?.statusCode ||
      500;

    // Buscar detalles adicionales
    const details = lastError.details || lastError.error?.details;

    return {
      message: message || "Error interno del servidor",
      code,
      statusCode,
      details,
    };
  }

  // Si es un string o primitivo
  return {
    message: lastError.toString(),
    statusCode: 500,
  };
}

/**
 * Formatea la respuesta de error para la API
 * @param exceptions Array de excepciones del ExceptionManager
 * @param statusCode Status code principal del ExceptionManager
 * @returns Respuesta formateada para la API
 */
export function formatErrorResponse(
  exceptions: any[],
  statusCode: number
): {
  statusCode: number;
  body: string;
} {
  const lastError = extractLastError(exceptions);

  return {
    statusCode: lastError.statusCode || statusCode,
    body: JSON.stringify({
      success: false,
      error: {
        message: lastError.message,
        code: lastError.code,
        details: lastError.details,
      },
    }),
  };
}
