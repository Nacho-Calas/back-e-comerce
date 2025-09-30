import { UUID } from "@hex-lib/core";
import { Orden } from "@/dashboard/src/domain/entities/orden.entity";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import {
  OrdenDTO,
  ItemOrdenDTO,
  DireccionEnvioDTO,
  InformacionPagoDTO,
  UpdateOrdenDTO,
} from "../dtos/orden.dto";

export class OrdenMapper {
  static fromDynamoDB(item: Record<string, AttributeValue>): Orden {
    const rawItem = unmarshall(item);
    return new Orden({
      id: new UUID(rawItem.id),
      numeroOrden: rawItem.numeroOrden,
      usuarioId: rawItem.usuarioId,
      items: rawItem.items || [],
      direccionEnvio: rawItem.direccionEnvio,
      informacionPago: rawItem.informacionPago,
      subtotal: rawItem.subtotal,
      costoEnvio: rawItem.costoEnvio,
      descuento: rawItem.descuento,
      total: rawItem.total,
      estado: rawItem.estado,
      fechaCreacion: rawItem.fechaCreacion,
      fechaActualizacion: new Date(rawItem.fechaActualizacion).toISOString(),
      fechaEnvio: rawItem.fechaEnvio,
      fechaEntrega: rawItem.fechaEntrega,
      numeroSeguimiento: rawItem.numeroSeguimiento,
      notas: rawItem.notas,
    });
  }

  static toDynamoDB(orden: Orden): Record<string, AttributeValue> {
    const plainOrden = {
      id: orden.getId().getValue(),
      numeroOrden: orden.getNumeroOrden(),
      usuarioId: orden.getUsuarioId(),
      items: orden.getItems(),
      direccionEnvio: orden.getDireccionEnvio(),
      informacionPago: orden.getInformacionPago(),
      subtotal: orden.getSubtotal(),
      costoEnvio: orden.getCostoEnvio(),
      descuento: orden.getDescuento(),
      total: orden.getTotal(),
      estado: orden.getEstado(),
      fechaCreacion: orden.getFechaCreacion(),
      fechaActualizacion: orden.getFechaActualizacion(),
      fechaEnvio: orden.getFechaEnvio(),
      fechaEntrega: orden.getFechaEntrega(),
      numeroSeguimiento: orden.getNumeroSeguimiento(),
      notas: orden.getNotas(),
    };
    return marshall(plainOrden, {
      convertClassInstanceToMap: true,
      removeUndefinedValues: true,
    });
  }

  static toEntity(dto: UpdateOrdenDTO, existingOrden?: Orden): Orden {
    if (!existingOrden) {
      throw new Error("Se requiere una orden existente para actualizar");
    }

    return new Orden({
      id: existingOrden.getId(),
      numeroOrden: existingOrden.getNumeroOrden(),
      usuarioId: existingOrden.getUsuarioId(),
      items: existingOrden.getItems(),
      direccionEnvio: existingOrden.getDireccionEnvio(),
      informacionPago: existingOrden.getInformacionPago(),
      subtotal: existingOrden.getSubtotal(),
      costoEnvio: existingOrden.getCostoEnvio(),
      descuento: existingOrden.getDescuento(),
      total: existingOrden.getTotal(),
      estado: dto.estado ?? existingOrden.getEstado(),
      fechaCreacion: existingOrden.getFechaCreacion(),
      fechaActualizacion: new Date().toISOString(),
      fechaEnvio: existingOrden.getFechaEnvio(),
      fechaEntrega: existingOrden.getFechaEntrega(),
      numeroSeguimiento:
        dto.numeroSeguimiento ?? existingOrden.getNumeroSeguimiento(),
      notas: dto.notas ?? existingOrden.getNotas(),
    });
  }

  static toDTO(orden: Orden): OrdenDTO {
    const direccionEnvio = orden.getDireccionEnvio();
    const informacionPago = orden.getInformacionPago();

    return new OrdenDTO({
      id: orden.getId().getValue(),
      numeroOrden: orden.getNumeroOrden(),
      usuarioId: orden.getUsuarioId(),
      items: orden.getItems().map(
        (item) =>
          new ItemOrdenDTO({
            productoId: item.productoId,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
            imagen: item.imagen,
            especificaciones: item.especificaciones,
          })
      ),
      direccionEnvio: new DireccionEnvioDTO({
        nombre: direccionEnvio.nombre,
        apellido: direccionEnvio.apellido,
        direccion: direccionEnvio.direccion,
        ciudad: direccionEnvio.ciudad,
        provincia: direccionEnvio.provincia,
        codigoPostal: direccionEnvio.codigoPostal,
        telefono: direccionEnvio.telefono,
        email: direccionEnvio.email,
        instrucciones: direccionEnvio.instrucciones,
      }),
      informacionPago: new InformacionPagoDTO({
        metodo: informacionPago.metodo,
        numeroTarjeta: informacionPago.numeroTarjeta,
        fechaVencimiento: informacionPago.fechaVencimiento,
        nombreTitular: informacionPago.nombreTitular,
        transaccionId: informacionPago.transaccionId,
      }),
      subtotal: orden.getSubtotal(),
      costoEnvio: orden.getCostoEnvio(),
      descuento: orden.getDescuento(),
      total: orden.getTotal(),
      estado: orden.getEstado(),
      fechaCreacion: orden.getFechaCreacion(),
      fechaActualizacion: orden.getFechaActualizacion(),
      fechaEnvio: orden.getFechaEnvio(),
      fechaEntrega: orden.getFechaEntrega(),
      numeroSeguimiento: orden.getNumeroSeguimiento(),
      notas: orden.getNotas(),
    });
  }
}
