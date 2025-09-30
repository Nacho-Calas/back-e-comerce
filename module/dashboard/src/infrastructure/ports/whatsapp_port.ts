import { IPort } from "@hex-lib/core";

export interface IWhatsAppPort extends IPort {
  enviarMensaje(mensaje: string, numero: string): Promise<boolean>;
  generarUrlWhatsApp(mensaje: string, numero: string): string;
  validarNumero(numero: string): boolean;
}
