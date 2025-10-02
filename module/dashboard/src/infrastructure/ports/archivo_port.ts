import { IPort } from "@hex-lib/core";

export interface IArchivoPort extends IPort {
  generarPresignedUrl(
    nombreArchivo: string,
    tipo: "imagen" | "video" | "archivo",
    entidadId: string,
    extension: string
  ): Promise<{
    presignedUrl: string;
    key: string;
    nombreArchivo: string;
    urlPublica: string;
  }>;
}
