import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  Adapter,
  AdapterDecorator,
  type AdapterDependencies,
} from "@hex-lib/core";
import { IArchivoPort } from "../ports/archivo_port";

export interface S3ArchivoAdapterDependencies
  extends Partial<AdapterDependencies> {
  vars: {
    S3_BUCKET_NAME: string;
    AWS_REGION: string;
  };
}

const s3ArchivoAdapterDependencies: S3ArchivoAdapterDependencies = {
  vars: {
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || "back-e-comerce-files-dev",
    AWS_REGION: process.env.AWS_REGION || "us-east-2",
  },
};

@AdapterDecorator(s3ArchivoAdapterDependencies)
export class S3ArchivoAdapter
  extends Adapter<S3ArchivoAdapterDependencies>
  implements IArchivoPort
{
  private s3Client: S3Client;

  constructor() {
    super();
    this.s3Client = new S3Client({
      region: this.getVar("AWS_REGION"),
    });
  }

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
      message: "Generando presigned URL para archivo",
      context: this.getContext(),
      metadata: { nombreArchivo, tipo, entidadId, extension },
    });

    // Mapear tipo a carpeta
    const carpetaTipo = this.mapearTipoACarpeta(tipo);

    // Generar key con estructura: {entidadId}/{tipo}/{archivo}
    const key = `${entidadId}/${carpetaTipo}/${nombreArchivo}.${extension}`;

    // Crear comando para subir objeto
    const command = new PutObjectCommand({
      Bucket: this.getVar("S3_BUCKET_NAME"),
      Key: key,
      ContentType: this.getContentType(extension),
    });

    // Generar presigned URL (válida por 1 hora)
    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hora
    });

    // Generar URL pública
    const urlPublica = `https://${this.getVar(
      "S3_BUCKET_NAME"
    )}.s3.${this.getVar("AWS_REGION")}.amazonaws.com/${key}`;

    this.getLogger().info({
      message: "Presigned URL generada exitosamente",
      context: this.getContext(),
      metadata: { key, urlPublica },
    });

    return {
      presignedUrl,
      key,
      nombreArchivo,
      urlPublica,
    };
  }

  // Mapear tipo de archivo a nombre de carpeta
  private mapearTipoACarpeta(tipo: "imagen" | "video" | "archivo"): string {
    switch (tipo) {
      case "imagen":
        return "imagenes";
      case "video":
        return "videos";
      case "archivo":
        return "archivos";
      default:
        throw new Error(`Tipo de archivo no soportado: ${tipo}`);
    }
  }

  private getContentType(extension: string): string {
    const extensionLower = extension.toLowerCase();

    // Imágenes
    if (["jpg", "jpeg"].includes(extensionLower)) return "image/jpeg";
    if (extensionLower === "png") return "image/png";
    if (extensionLower === "gif") return "image/gif";
    if (extensionLower === "webp") return "image/webp";
    if (extensionLower === "svg") return "image/svg+xml";

    // Videos
    if (extensionLower === "mp4") return "video/mp4";
    if (extensionLower === "avi") return "video/x-msvideo";
    if (extensionLower === "mov") return "video/quicktime";
    if (extensionLower === "webm") return "video/webm";

    // Documentos
    if (extensionLower === "pdf") return "application/pdf";
    if (extensionLower === "doc") return "application/msword";
    if (extensionLower === "docx")
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (extensionLower === "xls") return "application/vnd.ms-excel";
    if (extensionLower === "xlsx")
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (extensionLower === "ppt") return "application/vnd.ms-powerpoint";
    if (extensionLower === "pptx")
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    if (extensionLower === "txt") return "text/plain";

    // Por defecto
    return "application/octet-stream";
  }
}
