import { IPort } from "@hex-lib/core";

export interface IArchivoPort extends IPort {
  generarPresignedUrl(
    fileName: string,
    fileType: string,
    entidadId: string,
    tipo: "imagen" | "video" | "archivo"
  ): Promise<{
    presignedUrl: string;
    key: string;
    nombreArchivo: string;
    urlPublica: string;
  }>;
}
