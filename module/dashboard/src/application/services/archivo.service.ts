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
    nombreArchivo: string,
    tipo: "imagen" | "video" | "archivo",
    entidadId: string,
    extension: string
  ): Promise<{
    presignedUrl: string;
    key: string;
    nombreArchivo: string;
    urlPublica: string;
  }> {
    this.getLogger().info({
      message: "Iniciando generación de presigned URL",
      context: this.getContext(),
      metadata: { nombreArchivo, tipo, entidadId, extension },
    });

    // Validaciones de negocio
    this.validarParametros(nombreArchivo, tipo, entidadId, extension);

    const archivoPort = this.getPort("archivoPort");
    const resultado = await archivoPort.generarPresignedUrl(
      nombreArchivo,
      tipo,
      entidadId,
      extension
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
    nombreArchivo: string,
    tipo: string,
    entidadId: string,
    extension: string
  ): void {
    if (!nombreArchivo || nombreArchivo.trim() === "") {
      throw new Error("El nombre del archivo es requerido");
    }

    if (!tipo || !["imagen", "video", "archivo"].includes(tipo)) {
      throw new Error("El tipo debe ser 'imagen', 'video' o 'archivo'");
    }

    if (!entidadId || entidadId.trim() === "") {
      throw new Error("El ID de la entidad es requerido");
    }

    if (!extension || extension.trim() === "") {
      throw new Error("La extensión del archivo es requerida");
    }

    // Validar que el nombre del archivo no contenga caracteres peligrosos
    const nombreLimpio = nombreArchivo.trim();
    if (
      nombreLimpio.includes("[object Object]") ||
      nombreLimpio.includes("undefined") ||
      nombreLimpio.includes("null")
    ) {
      throw new Error("El nombre del archivo contiene valores inválidos");
    }

    // Validar extensión
    const extensionLimpia = extension.toLowerCase().trim();
    const extensionesValidas = [
      // Imágenes
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      // Videos
      "mp4",
      "avi",
      "mov",
      "webm",
      // Documentos
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "txt",
    ];

    if (!extensionesValidas.includes(extensionLimpia)) {
      throw new Error(`Extensión de archivo no soportada: ${extension}`);
    }
  }
}
