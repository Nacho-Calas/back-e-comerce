import { UUID } from "@hex-lib/core";
import { Producto } from "@/dashboard/src/domain/entities/producto.entity";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import {
  UpdateProductoDTO,
  ProductoDTO,
  InformacionEnvioDTO,
  EspecificacionesDTO,
} from "../dtos/producto.dto";
import { CategoriaProductoEnum } from "@/dashboard/src/domain/enums/categoria_producto.enum";
import { EstadoProductoEnum } from "@/dashboard/src/domain/enums/estado_producto.enum";

export class ProductoMapper {
  static fromDynamoDB(item: Record<string, AttributeValue>): Producto {
    const rawItem = unmarshall(item);
    return new Producto({
      id: new UUID(rawItem.id),
      nombre: rawItem.nombre,
      descripcion: rawItem.descripcion,
      precio: rawItem.precio,
      precioOriginal: rawItem.precioOriginal,
      estado: rawItem.estado,
      categoria: rawItem.categoria,
      informacionEnvio: rawItem.informacionEnvio,
      destacado: rawItem.destacado === "true",
      stock: rawItem.stock,
      stockMinimo: rawItem.stockMinimo,
      especificaciones: rawItem.especificaciones || {},
      caracteristicas: rawItem.caracteristicas || [],
      imagenes: rawItem.imagenes || [],
      videos: rawItem.videos,
      manuales: rawItem.manuales,
      activo: rawItem.activo === "true",
      fechaCreacion: rawItem.fechaCreacion,
      fechaActualizacion: new Date(rawItem.fechaActualizacion).toISOString(),
    });
  }

  static toDynamoDB(producto: Producto): Record<string, AttributeValue> {
    const plainProducto = {
      id: producto.getId().getValue(),
      nombre: producto.getNombre(),
      descripcion: producto.getDescripcion(),
      precio: producto.getPrecio(),
      precioOriginal: producto.getPrecioOriginal(),
      estado: producto.getEstado(),
      categoria: producto.getCategoria(),
      informacionEnvio: producto.getInformacionEnvio(),
      destacado: producto.isDestacado().toString(),
      stock: producto.getStock(),
      stockMinimo: producto.getStockMinimo(),
      especificaciones: producto.getEspecificaciones(),
      caracteristicas: producto.getCaracteristicas(),
      imagenes: producto.getImagenes(),
      videos: producto.getVideos(),
      manuales: producto.getManuales(),
      activo: producto.isActivo().toString(),
      fechaCreacion: producto.getFechaCreacion(),
      fechaActualizacion: producto.getFechaActualizacion(),
    };
    return marshall(plainProducto, {
      convertClassInstanceToMap: true,
      removeUndefinedValues: true,
    });
  }

  static toEntity(dto: UpdateProductoDTO): Producto {
    return new Producto({
      id: new UUID(dto.id),
      nombre: dto.nombre || "",
      descripcion: dto.descripcion || "",
      precio: dto.precio || 0,
      precioOriginal: dto.precioOriginal,
      estado: dto.estado || EstadoProductoEnum.DISPONIBLE,
      categoria: dto.categoria || CategoriaProductoEnum.ELECTRONICOS,
      informacionEnvio: dto.informacionEnvio || {
        peso: 0,
        dimensiones: { largo: 0, ancho: 0, alto: 0 },
        fragil: false,
        requiereFirma: false,
      },
      destacado: dto.destacado ?? false,
      stock: dto.stock || 0,
      stockMinimo: dto.stockMinimo || 0,
      especificaciones: dto.especificaciones || {},
      caracteristicas: dto.caracteristicas || [],
      imagenes: dto.imagenes || [],
      videos: dto.videos,
      manuales: dto.manuales,
      activo: dto.activo ?? true,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    });
  }

  static mergeForUpdate(
    existingProducto: Producto,
    dto: UpdateProductoDTO
  ): Producto {
    return new Producto({
      id: existingProducto.getId(),
      nombre: dto.nombre ?? existingProducto.getNombre(),
      descripcion: dto.descripcion ?? existingProducto.getDescripcion(),
      precio: dto.precio ?? existingProducto.getPrecio(),
      precioOriginal:
        dto.precioOriginal ?? existingProducto.getPrecioOriginal(),
      estado: dto.estado ?? existingProducto.getEstado(),
      categoria: dto.categoria ?? existingProducto.getCategoria(),
      informacionEnvio: dto.informacionEnvio
        ? {
            peso: dto.informacionEnvio.peso,
            dimensiones: dto.informacionEnvio.dimensiones,
            fragil: dto.informacionEnvio.fragil,
            requiereFirma: dto.informacionEnvio.requiereFirma,
          }
        : existingProducto.getInformacionEnvio(),
      destacado: dto.destacado ?? existingProducto.isDestacado(),
      stock: dto.stock ?? existingProducto.getStock(),
      stockMinimo: dto.stockMinimo ?? existingProducto.getStockMinimo(),
      especificaciones:
        dto.especificaciones ?? existingProducto.getEspecificaciones(),
      caracteristicas:
        dto.caracteristicas ?? existingProducto.getCaracteristicas(),
      imagenes: dto.imagenes ?? existingProducto.getImagenes(),
      videos: dto.videos ?? existingProducto.getVideos(),
      manuales: dto.manuales ?? existingProducto.getManuales(),
      activo: dto.activo ?? existingProducto.isActivo(),
      fechaCreacion: existingProducto.getFechaCreacion(),
      fechaActualizacion: new Date().toISOString(),
    });
  }

  static toDTO(producto: Producto): ProductoDTO {
    const informacionEnvio = producto.getInformacionEnvio();

    return new ProductoDTO({
      id: producto.getId().getValue(),
      nombre: producto.getNombre(),
      descripcion: producto.getDescripcion(),
      precio: producto.getPrecio(),
      precioOriginal: producto.getPrecioOriginal(),
      estado: producto.getEstado(),
      categoria: producto.getCategoria(),
      informacionEnvio: new InformacionEnvioDTO({
        peso: informacionEnvio.peso,
        dimensiones: informacionEnvio.dimensiones,
        fragil: informacionEnvio.fragil,
        requiereFirma: informacionEnvio.requiereFirma,
      }),
      destacado: producto.isDestacado(),
      stock: producto.getStock(),
      stockMinimo: producto.getStockMinimo(),
      especificaciones: new EspecificacionesDTO(producto.getEspecificaciones()),
      caracteristicas: producto.getCaracteristicas(),
      imagenes: producto.getImagenes(),
      videos: producto.getVideos(),
      manuales: producto.getManuales(),
      activo: producto.isActivo(),
      fechaCreacion: producto.getFechaCreacion(),
      fechaActualizacion: producto.getFechaActualizacion(),
    });
  }
}
