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
      region: process.env.AWS_REGION || "us-east-2",
    });
  }

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
      message: "Generando presigned URL para archivo",
      context: this.getContext(),
      metadata: { fileName, fileType, entidadId, tipo },
    });

    // Extraer nombre del archivo sin extensión
    const nombreSinExtension = this.extraerNombreSinExtension(fileName);

    // Mapear tipo a nombre de carpeta
    const carpetaTipo = this.mapearTipoACarpeta(tipo);

    // Generar key con estructura: {entidadId}/{tipo}/{archivo}
    const key = `${entidadId}/${carpetaTipo}/${fileName}`;

    // Crear comando para subir objeto
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME || "back-e-comerce-files-dev",
      Key: key,
      ContentType: fileType,
    });

    // Generar presigned URL (válida por 1 hora)
    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600, // 1 hora
    });

    // Generar URL pública
    const urlPublica = `https://${
      process.env.S3_BUCKET_NAME || "back-e-comerce-files-dev"
    }.s3.${process.env.AWS_REGION || "us-east-2"}.amazonaws.com/${key}`;

    this.getLogger().info({
      message: "Presigned URL generada exitosamente",
      context: this.getContext(),
      metadata: { key, urlPublica },
    });

    return {
      presignedUrl,
      key,
      nombreArchivo: nombreSinExtension,
      urlPublica,
    };
  }

  // Extraer nombre del archivo sin extensión
  private extraerNombreSinExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return fileName;
    }
    return fileName.substring(0, lastDotIndex);
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
}
