import {
  Service,
  ServiceDecorator,
  type ServiceDependencies,
  IContextuable,
  ILoggeable,
} from "@hex-lib/core";
import { Carrito } from "@/dashboard/domain/entities/carrito.entity";

interface WhatsAppServiceDependencies extends Partial<ServiceDependencies> {
  vars: {
    whatsappNumber: string;
    companyName: string;
  };
}

const whatsappServiceDependencies: WhatsAppServiceDependencies = {
  vars: {
    whatsappNumber: process.env.WHATSAPP_NUMBER || "",
    companyName: process.env.COMPANY_NAME || "Warehouse Solutions",
  },
};

@ServiceDecorator(whatsappServiceDependencies)
export class WhatsAppService
  extends Service<WhatsAppServiceDependencies>
  implements IContextuable, ILoggeable
{
  /**
   * Genera un mensaje de WhatsApp con el contenido del carrito
   * @param carrito - Carrito con los productos seleccionados
   * @returns Objeto con el mensaje y la URL de WhatsApp
   */
  async generarMensajePedido(carrito: Carrito): Promise<{
    mensaje: string;
    urlWhatsApp: string;
    totalFormateado: string;
  }> {
    this.getLogger().info({
      message: "Generando mensaje de pedido para WhatsApp",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });

    const items = carrito.getItems();
    const total = carrito.getSubtotal();
    const totalFormateado = carrito.getSubtotalFormateado();

    // Generar el mensaje
    const mensaje = this.construirMensaje(items, totalFormateado);

    // Generar la URL de WhatsApp
    const urlWhatsApp = this.generarUrlWhatsApp(mensaje);

    this.getLogger().info({
      message: "Mensaje de pedido generado exitosamente",
      context: this.getContext(),
      metadata: {
        carritoId: carrito.getId().getValue(),
        totalItems: carrito.getTotalItems(),
        total: totalFormateado,
      },
    });

    return {
      mensaje,
      urlWhatsApp,
      totalFormateado,
    };
  }

  /**
   * Construye el mensaje de texto para WhatsApp
   */
  private construirMensaje(items: any[], totalFormateado: string): string {
    const companyName = this.getVar("companyName");

    let mensaje = `Hola! Me interesa hacer un pedido de ${companyName}:\n\n`;

    if (items.length === 0) {
      mensaje += "No hay productos en el carrito.";
      return mensaje;
    }

    // Agregar cada producto al mensaje
    items.forEach((item, index) => {
      mensaje += `${index + 1}. ${item.nombre}`;
      mensaje += ` x ${item.cantidad} unidad${item.cantidad > 1 ? "es" : ""}`;

      if (
        item.especificaciones &&
        Object.keys(item.especificaciones).length > 0
      ) {
        mensaje += `\n   Especificaciones: `;
        const specs = Object.entries(item.especificaciones)
          .filter(
            ([_, value]) =>
              value !== undefined && value !== null && value !== ""
          )
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        mensaje += specs;
      }

      mensaje += `\n   Precio unitario: $${(item.precio / 100).toFixed(2)}`;
      mensaje += `\n   Subtotal: $${(
        (item.precio * item.cantidad) /
        100
      ).toFixed(2)}\n\n`;
    });

    // Agregar total
    mensaje += `💰 Total estimado: ${totalFormateado}\n\n`;

    // Agregar información adicional
    mensaje += `📋 Detalles del pedido:\n`;
    mensaje += `• Total de productos: ${items.length}\n`;
    mensaje += `• Cantidad total de unidades: ${items.reduce(
      (sum, item) => sum + item.cantidad,
      0
    )}\n\n`;

    mensaje += `Por favor, confírmame:\n`;
    mensaje += `• Disponibilidad de los productos\n`;
    mensaje += `• Tiempo de entrega estimado\n`;
    mensaje += `• Forma de pago y envío\n\n`;

    mensaje += `¡Gracias! 🙏`;

    return mensaje;
  }

  /**
   * Genera la URL de WhatsApp con el mensaje codificado
   */
  private generarUrlWhatsApp(mensaje: string): string {
    const whatsappNumber = this.getVar("whatsappNumber");
    const mensajeCodificado = encodeURIComponent(mensaje);

    return `https://wa.me/${whatsappNumber}?text=${mensajeCodificado}`;
  }

  /**
   * Genera un mensaje de consulta rápida para un producto específico
   */
  async generarMensajeConsulta(producto: any): Promise<{
    mensaje: string;
    urlWhatsApp: string;
  }> {
    this.getLogger().info({
      message: "Generando mensaje de consulta para producto",
      context: this.getContext(),
      metadata: { productoId: producto.id },
    });

    const companyName = this.getVar("companyName");

    let mensaje = `Hola! Me interesa el siguiente producto de ${companyName}:\n\n`;
    mensaje += `🔧 ${producto.nombre}\n`;
    mensaje += `📝 ${producto.descripcion}\n`;
    mensaje += `💰 Precio: $${(producto.precio / 100).toFixed(2)}\n`;

    if (
      producto.especificaciones &&
      Object.keys(producto.especificaciones).length > 0
    ) {
      mensaje += `\n📋 Especificaciones:\n`;
      Object.entries(producto.especificaciones).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          mensaje += `• ${key}: ${value}\n`;
        }
      });
    }

    mensaje += `\nPor favor, necesito información sobre:\n`;
    mensaje += `• Disponibilidad\n`;
    mensaje += `• Tiempo de entrega\n`;
    mensaje += `• Descuentos por cantidad\n`;
    mensaje += `• Formas de pago\n\n`;
    mensaje += `¡Gracias! 🙏`;

    const urlWhatsApp = this.generarUrlWhatsApp(mensaje);

    return {
      mensaje,
      urlWhatsApp,
    };
  }
}
