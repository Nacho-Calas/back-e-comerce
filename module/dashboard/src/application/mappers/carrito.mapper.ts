import { UUID } from "@hex-lib/core";
import { Carrito } from "@/dashboard/domain/entities/carrito.entity";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import {
  CarritoDTO,
  ItemCarritoDTO,
  UpdateCarritoDTO,
} from "../dtos/carrito.dto";

export class CarritoMapper {
  static fromDynamoDB(item: Record<string, AttributeValue>): Carrito {
    const rawItem = unmarshall(item);
    return new Carrito({
      id: new UUID(rawItem.id),
      sessionId: rawItem.sessionId,
      items: rawItem.items || [],
      fechaCreacion: rawItem.fechaCreacion,
      fechaActualizacion: new Date(rawItem.fechaActualizacion).toISOString(),
    });
  }

  static toDynamoDB(carrito: Carrito): Record<string, AttributeValue> {
    const plainCarrito = {
      id: carrito.getId().getValue(),
      sessionId: carrito.getSessionId(),
      items: carrito.getItems(),
      fechaCreacion: carrito.getFechaCreacion(),
      fechaActualizacion: carrito.getFechaActualizacion(),
    };
    return marshall(plainCarrito, {
      convertClassInstanceToMap: true,
      removeUndefinedValues: true,
    });
  }

  static toEntity(dto: UpdateCarritoDTO): Carrito {
    return new Carrito({
      id: new UUID(dto.id),
      sessionId: dto.sessionId,
      items: dto.items.map((item) => ({
        productoId: item.productoId,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        imagen: item.imagen || null,
        especificaciones: item.especificaciones || null,
      })),
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    });
  }

  static mergeForUpdate(
    existingCarrito: Carrito,
    dto: UpdateCarritoDTO
  ): Carrito {
    return new Carrito({
      id: existingCarrito.getId(),
      sessionId: dto.sessionId,
      items: dto.items.map((item) => ({
        productoId: item.productoId,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        imagen: item.imagen || null,
        especificaciones: item.especificaciones || null,
      })),
      fechaCreacion: existingCarrito.getFechaCreacion(),
      fechaActualizacion: new Date().toISOString(),
    });
  }

  static toDTO(carrito: Carrito): CarritoDTO {
    return new CarritoDTO({
      id: carrito.getId().getValue(),
      sessionId: carrito.getSessionId(),
      items: carrito.getItems().map(
        (item) =>
          new ItemCarritoDTO({
            productoId: item.productoId,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
            imagen: item.imagen || null,
            especificaciones: item.especificaciones || null,
          })
      ),
      fechaCreacion: carrito.getFechaCreacion(),
      fechaActualizacion: carrito.getFechaActualizacion(),
      total: carrito.getSubtotal(),
      totalItems: carrito.getTotalItems(),
    });
  }
}
