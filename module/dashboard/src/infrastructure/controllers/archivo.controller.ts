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
      const { fileName, fileType, entidadId, tipo } =
        event.queryStringParameters || {};

      // Validaciones básicas
      if (!fileName || !fileType || !entidadId || !tipo) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: {
              message:
                "Faltan parámetros requeridos: fileName, fileType, entidadId, tipo",
              code: "MISSING_PARAMETERS",
            },
          }),
        };
      }

      // Validar que fileName sea un string válido
      if (typeof fileName !== "string" || fileName.trim() === "") {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: {
              message:
                "fileName debe ser un string válido y no puede estar vacío",
              code: "INVALID_FILENAME",
            },
          }),
        };
      }

      // Validar que fileType sea un string válido
      if (typeof fileType !== "string" || fileType.trim() === "") {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: {
              message:
                "fileType debe ser un string válido y no puede estar vacío",
              code: "INVALID_FILETYPE",
            },
          }),
        };
      }

      // Validar que entidadId sea un string válido
      if (typeof entidadId !== "string" || entidadId.trim() === "") {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: {
              message:
                "entidadId debe ser un string válido y no puede estar vacío",
              code: "INVALID_ENTIDAD_ID",
            },
          }),
        };
      }

      // Validar que tipo sea un string válido
      if (
        typeof tipo !== "string" ||
        !["imagen", "video", "archivo"].includes(tipo)
      ) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: {
              message: "tipo debe ser 'imagen', 'video' o 'archivo'",
              code: "INVALID_TIPO",
            },
          }),
        };
      }

      // Limpiar y validar el nombre del archivo
      const fileNameLimpio = fileName.trim();
      if (
        fileNameLimpio.includes("[object Object]") ||
        fileNameLimpio.includes("undefined")
      ) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            error: {
              message: "fileName contiene valores inválidos",
              code: "INVALID_FILENAME_CONTENT",
            },
          }),
        };
      }

      // Generar presigned URL usando el servicio
      const archivoService = this.getService("archivoService");
      const resultado = await archivoService.generarPresignedUrl(
        fileNameLimpio,
        fileType.trim(),
        entidadId.trim(),
        tipo as "imagen" | "video" | "archivo"
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
