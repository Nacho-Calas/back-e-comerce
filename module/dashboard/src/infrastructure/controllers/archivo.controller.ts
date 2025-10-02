import {
  Controller,
  AdapterDecorator,
  type AdapterDependencies,
  IContextuable,
  IThrowable,
  ILoggeable,
} from "@hex-lib/core";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ArchivoService } from "../../application/services/archivo.service";

export interface ArchivoControllerDependencies
  extends Partial<AdapterDependencies> {
  services: {
    archivoService: ArchivoService;
  };
}

const archivoControllerDependencies: ArchivoControllerDependencies = {
  services: {
    archivoService: new ArchivoService(),
  },
};

@AdapterDecorator(archivoControllerDependencies)
export class ArchivoController
  extends Controller<ArchivoControllerDependencies>
  implements IContextuable, IThrowable, ILoggeable
{
  /**
   * Generar presigned URL para subir archivo
   */
  async generarPresignedUrl(
    event: APIGatewayProxyEventV2
  ): Promise<APIGatewayProxyResultV2> {
    try {
      this.getLogger().info({
        message: "Solicitud de presigned URL recibida",
        context: this.getContext(),
        metadata: { queryParams: event.queryStringParameters },
      });

      // Obtener parámetros de query string
      const { nombreArchivo, tipo, entidadId, extension } =
        event.queryStringParameters || {};

      // Validaciones básicas
      if (!nombreArchivo || !tipo || !entidadId || !extension) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: {
              message:
                "Faltan parámetros requeridos: nombreArchivo, tipo, entidadId, extension",
              code: "MISSING_PARAMETERS",
            },
          }),
        };
      }

      // Validar que nombreArchivo sea un string válido
      if (typeof nombreArchivo !== "string" || nombreArchivo.trim() === "") {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: {
              message:
                "nombreArchivo debe ser un string válido y no puede estar vacío",
              code: "INVALID_FILENAME",
            },
          }),
        };
      }

      // Limpiar y validar el nombre del archivo
      const nombreArchivoLimpio = nombreArchivo.trim();
      if (
        nombreArchivoLimpio.includes("[object Object]") ||
        nombreArchivoLimpio.includes("undefined")
      ) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: {
              message: "nombreArchivo contiene valores inválidos",
              code: "INVALID_FILENAME_CONTENT",
            },
          }),
        };
      }

      if (!["imagen", "video", "archivo"].includes(tipo)) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: {
              message: "El tipo debe ser 'imagen', 'video' o 'archivo'",
              code: "INVALID_FILE_TYPE",
            },
          }),
        };
      }

      // Generar presigned URL usando el servicio
      const archivoService = this.getService("archivoService");
      const resultado = await archivoService.generarPresignedUrl(
        nombreArchivoLimpio,
        tipo as "imagen" | "video" | "archivo",
        entidadId,
        extension
      );

      this.getLogger().info({
        message: "Presigned URL generada exitosamente",
        context: this.getContext(),
        metadata: { key: resultado.key },
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: resultado,
        }),
      };
    } catch (error) {
      this.getLogger().error({
        message: "Error generando presigned URL",
        context: this.getContext(),
        metadata: {
          error: error instanceof Error ? error.message : String(error),
        },
      });

      const exceptionManager = this.getExceptionManager();
      exceptionManager.handleException(error, this.getContext());

      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: {
            message: "Error interno del servidor",
            code: "INTERNAL_SERVER_ERROR",
          },
        }),
      };
    }
  }
}
