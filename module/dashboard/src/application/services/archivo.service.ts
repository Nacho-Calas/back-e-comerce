import {
  IContextuable,
  ILoggeable,
  Service,
  ServiceDecorator,
  type ServiceDependencies,
} from "@hex-lib/core";
import { S3ArchivoAdapter } from "../../infrastructure/adapters/s3-archivo.adapter";
import { IArchivoPort } from "../../infrastructure/ports/archivo_port";

interface ArchivoServiceDependencies extends Partial<ServiceDependencies> {
  ports: {
    archivoPort: IArchivoPort;
  };
}

const archivoServiceDependencies: ArchivoServiceDependencies = {
  ports: {
    archivoPort: new S3ArchivoAdapter(),
  },
};

@ServiceDecorator(archivoServiceDependencies)
export class ArchivoService
  extends Service<ArchivoServiceDependencies>
  implements IContextuable, ILoggeable
{
  /**
   * Generar presigned URL para subir archivo a S3
   */
  async generarPresignedUrl(
    fileName: string,
    fileType: string,
    entidadId: string,
    tipo: "imagen" | "video" | "archivo"
  ): Promise<{
    presignedUrl: string;
    key: string;
    nombreArchivo: string;
    urlPublica: string;
  }> {
    this.getLogger().info({
      message: "Iniciando generación de presigned URL",
      context: this.getContext(),
      metadata: { fileName, fileType, entidadId, tipo },
    });

    // Validaciones de negocio
    this.validarParametros(fileName, fileType, entidadId, tipo);

    const archivoPort = this.getPort("archivoPort");
    const resultado = await archivoPort.generarPresignedUrl(
      fileName,
      fileType,
      entidadId,
      tipo
    );

    this.getLogger().info({
      message: "Presigned URL generada exitosamente",
      context: this.getContext(),
      metadata: { key: resultado.key, urlPublica: resultado.urlPublica },
    });

    return resultado;
  }

  /**
   * Validar parámetros de entrada
   */
  private validarParametros(
    fileName: string,
    fileType: string,
    entidadId: string,
    tipo: string
  ): void {
    if (!fileName || fileName.trim() === "") {
      throw new Error("El nombre del archivo es requerido");
    }

    if (!fileType || fileType.trim() === "") {
      throw new Error("El tipo de archivo (MIME type) es requerido");
    }

    if (!entidadId || entidadId.trim() === "") {
      throw new Error("El ID de la entidad es requerido");
    }

    if (!tipo || !["imagen", "video", "archivo"].includes(tipo)) {
      throw new Error("El tipo debe ser 'imagen', 'video' o 'archivo'");
    }

    // Validar que el nombre del archivo no contenga caracteres peligrosos
    const nombreLimpio = fileName.trim();
    if (
      nombreLimpio.includes("[object Object]") ||
      nombreLimpio.includes("undefined") ||
      nombreLimpio.includes("null")
    ) {
      throw new Error("El nombre del archivo contiene valores inválidos");
    }

    // Validar que el fileName tenga extensión
    if (!nombreLimpio.includes(".")) {
      throw new Error("El nombre del archivo debe incluir la extensión");
    }

    // Validar que el entidadId no contenga caracteres peligrosos
    const entidadIdLimpio = entidadId.trim();
    if (
      entidadIdLimpio.includes("..") ||
      entidadIdLimpio.includes("//") ||
      entidadIdLimpio.startsWith("/") ||
      entidadIdLimpio.endsWith("/")
    ) {
      throw new Error("El ID de la entidad contiene caracteres inválidos");
    }

    // Validar MIME type básico
    const mimeTypesValidos = [
      // Imágenes
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      // Videos
      "video/mp4",
      "video/avi",
      "video/quicktime",
      "video/webm",
      // Documentos
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ];

    if (!mimeTypesValidos.includes(fileType)) {
      throw new Error(`Tipo de archivo no soportado: ${fileType}`);
    }
  }
}
