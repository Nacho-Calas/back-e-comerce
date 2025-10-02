import { WhatsAppService } from "@/dashboard/src/application/services/whatsapp.service";
import { CarritoService } from "@/dashboard/src/application/services/carrito.service";
import {
  IContextuable,
  ILoggeable,
  IThrowable,
  Controller,
  AdapterDecorator,
  type AdapterDependencies,
} from "@hex-lib/core";

export interface WhatsAppControllerDependencies
  extends Partial<AdapterDependencies> {
  services: {
    whatsappService: WhatsAppService;
    carritoService: CarritoService;
  };
}

const whatsappControllerDependencies: WhatsAppControllerDependencies = {
  services: {
    whatsappService: new WhatsAppService(),
    carritoService: new CarritoService(),
  },
};

@AdapterDecorator(whatsappControllerDependencies)
export class WhatsAppController
  extends Controller<WhatsAppControllerDependencies>
  implements IContextuable, IThrowable, ILoggeable
{
  /**
   * Generar mensaje de pedido desde el carrito
   */
  async generarMensajePedido(carritoId: string): Promise<{
    mensaje: string;
    urlWhatsApp: string;
    totalFormateado: string;
  }> {
    this.getLogger().info({
      message: "Solicitud de generación de mensaje de pedido",
      context: this.getContext(),
      metadata: { carritoId },
    });

    const carritoService = this.getService("carritoService");
    const whatsappService = this.getService("whatsappService");

    // Obtener el carrito
    const carritoDTO = await carritoService.getCarritoById(carritoId);
    if (!carritoDTO) {
      throw new Error("Carrito no encontrado");
    }

    // Convertir DTO a entidad para el servicio de WhatsApp
    const carrito = this.convertirDTOToEntity(carritoDTO);

    // Generar mensaje de WhatsApp
    const result = await whatsappService.generarMensajePedido(carrito);

    this.getLogger().info({
      message: "Mensaje de pedido generado exitosamente",
      context: this.getContext(),
      metadata: {
        carritoId,
        totalItems: carritoDTO.items.length,
        total: result.totalFormateado,
      },
    });

    return result;
  }

  /**
   * Generar mensaje de consulta para un producto específico
   */
  async generarMensajeConsulta(productoId: string): Promise<{
    mensaje: string;
    urlWhatsApp: string;
  }> {
    this.getLogger().info({
      message: "Solicitud de generación de mensaje de consulta",
      context: this.getContext(),
      metadata: { productoId },
    });

    const whatsappService = this.getService("whatsappService");

    // Obtener información del producto (simplificado para el ejemplo)
    const producto = {
      id: productoId,
      nombre: "Producto de ejemplo", // En la implementación real, obtendrías esto de la base de datos
      descripcion: "Descripción del producto",
      precio: 10000, // precio en centavos
      especificaciones: {
        marca: "Marca ejemplo",
        modelo: "Modelo ejemplo",
      },
    };

    // Generar mensaje de consulta
    const result = await whatsappService.generarMensajeConsulta(producto);

    this.getLogger().info({
      message: "Mensaje de consulta generado exitosamente",
      context: this.getContext(),
      metadata: { productoId },
    });

    return result;
  }

  /**
   * Obtener configuración de WhatsApp
   */
  async getConfiguracion(): Promise<{
    numeroWhatsApp: string;
    nombreEmpresa: string;
  }> {
    this.getLogger().info({
      message: "Solicitud de configuración de WhatsApp",
      context: this.getContext(),
    });

    const whatsappService = this.getService("whatsappService");

    const numeroWhatsApp = process.env.WHATSAPP_NUMBER || "";
    const nombreEmpresa = process.env.COMPANY_NAME || "Depotix";

    this.getLogger().info({
      message: "Configuración de WhatsApp obtenida exitosamente",
      context: this.getContext(),
      metadata: { numeroWhatsApp, nombreEmpresa },
    });

    return {
      numeroWhatsApp,
      nombreEmpresa,
    };
  }

  /**
   * Convertir DTO de carrito a entidad (método auxiliar)
   */
  private convertirDTOToEntity(carritoDTO: any): any {
    // Esta es una implementación simplificada
    // En la implementación real, usarías el mapper correspondiente
    return {
      getId: () => ({ getValue: () => carritoDTO.id }),
      getItems: () => carritoDTO.items,
      getSubtotal: () =>
        carritoDTO.items.reduce(
          (total: number, item: any) => total + item.precio * item.cantidad,
          0
        ),
      getSubtotalFormateado: () => {
        const subtotal = carritoDTO.items.reduce(
          (total: number, item: any) => total + item.precio * item.cantidad,
          0
        );
        return `$${(subtotal / 100).toFixed(2)}`;
      },
      getTotalItems: () =>
        carritoDTO.items.reduce(
          (total: number, item: any) => total + item.cantidad,
          0
        ),
    };
  }
}
