import {
  Adapter,
  AdapterDecorator,
  type AdapterDependencies,
} from "@hex-lib/core";
import { IWhatsAppPort } from "@/dashboard/src/infrastructure/ports/whatsapp_port";

export interface WhatsAppAdapterDependencies
  extends Partial<AdapterDependencies> {
  vars: {
    WHATSAPP_NUMBER: string;
    WHATSAPP_API_URL?: string;
    WHATSAPP_API_TOKEN?: string;
  };
}

const whatsappAdapterDependencies: WhatsAppAdapterDependencies = {
  vars: {
    WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || "",
    WHATSAPP_API_URL: process.env.WHATSAPP_API_URL,
    WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN,
  },
};

@AdapterDecorator(whatsappAdapterDependencies)
export class WhatsAppAdapter
  extends Adapter<WhatsAppAdapterDependencies>
  implements IWhatsAppPort
{
  async enviarMensaje(mensaje: string, numero: string): Promise<boolean> {
    this.getLogger().info({
      message: "Enviando mensaje de WhatsApp",
      context: this.getContext(),
      metadata: { numero, mensajeLength: mensaje.length },
    });

    try {
      // Si hay una API de WhatsApp configurada, usarla
      const apiUrl = this.getVar("WHATSAPP_API_URL");
      const apiToken = this.getVar("WHATSAPP_API_TOKEN");

      if (apiUrl && apiToken) {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
          body: JSON.stringify({
            to: numero,
            message: mensaje,
          }),
        });

        if (response.ok) {
          this.getLogger().info({
            message: "Mensaje de WhatsApp enviado exitosamente",
            context: this.getContext(),
            metadata: { numero },
          });
          return true;
        } else {
          this.getLogger().error({
            message: "Error al enviar mensaje de WhatsApp",
            context: this.getContext(),
            metadata: { numero, status: response.status },
          });
          return false;
        }
      } else {
        // Si no hay API configurada, solo logear el mensaje
        this.getLogger().info({
          message: "Mensaje de WhatsApp generado (sin envío automático)",
          context: this.getContext(),
          metadata: {
            numero,
            mensaje,
            url: this.generarUrlWhatsApp(mensaje, numero),
          },
        });
        return true;
      }
    } catch (error) {
      this.getLogger().error({
        message: "Error al enviar mensaje de WhatsApp",
        context: this.getContext(),
        metadata: {
          numero,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
      return false;
    }
  }

  generarUrlWhatsApp(mensaje: string, numero: string): string {
    const mensajeCodificado = encodeURIComponent(mensaje);
    return `https://wa.me/${numero}?text=${mensajeCodificado}`;
  }

  validarNumero(numero: string): boolean {
    // Validar formato básico de número de teléfono
    const numeroLimpio = numero.replace(/\D/g, "");
    return numeroLimpio.length >= 10 && numeroLimpio.length <= 15;
  }
}
