import { UUID } from "@hex-lib/core";
import { Producto } from "@/dashboard/domain/entities/producto.entity";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import {
  UpdateProductoDTO,
  ProductoDTO,
  InformacionEnvioDTO,
  EspecificacionesDTO,
} from "../dtos/producto.dto";
import { CategoriaProductoEnum } from "@/dashboard/domain/enums/categoria_producto.enum";
import { EstadoProductoEnum } from "@/dashboard/domain/enums/estado_producto.enum";
import { instanceToPlain } from "class-transformer";

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
    const plainProducto = instanceToPlain(producto);
    plainProducto.fechaActualizacion = new Date().toISOString();
    return marshall(plainProducto);
  }

  static toEntity(
    dto: UpdateProductoDTO,
    existingProducto?: Producto
  ): Producto {
    const now = new Date().toISOString();

    const params: any = {
      id: new UUID(dto.id),
      nombre: dto.nombre || existingProducto?.getNombre() || "",
      descripcion: dto.descripcion || existingProducto?.getDescripcion() || "",
      precio: dto.precio || existingProducto?.getPrecio() || 0,
      estado:
        dto.estado ||
        existingProducto?.getEstado() ||
        EstadoProductoEnum.DISPONIBLE,
      categoria:
        dto.categoria ||
        existingProducto?.getCategoria() ||
        CategoriaProductoEnum.EQUIPOS_LOGISTICA,
      informacionEnvio: dto.informacionEnvio ||
        existingProducto?.getInformacionEnvio() || {
          peso: 0,
          dimensiones: { largo: 0, ancho: 0, alto: 0 },
          fragil: false,
          requiereFirma: false,
        },
      destacado:
        dto.destacado !== undefined
          ? dto.destacado
          : existingProducto?.isDestacado() ?? false,
      stock: dto.stock || existingProducto?.getStock() || 0,
      stockMinimo: dto.stockMinimo || existingProducto?.getStockMinimo() || 0,
      especificaciones:
        dto.especificaciones || existingProducto?.getEspecificaciones() || {},
      caracteristicas:
        dto.caracteristicas || existingProducto?.getCaracteristicas() || [],
      imagenes: dto.imagenes || existingProducto?.getImagenes() || [],
      activo:
        dto.activo !== undefined
          ? dto.activo
          : existingProducto?.isActivo() ?? true,
      fechaCreacion: existingProducto?.getFechaCreacion() || now,
      fechaActualizacion: now,
    };

    // Manejar campos opcionales
    if (
      dto.precioOriginal !== undefined ||
      existingProducto?.getPrecioOriginal() !== undefined
    ) {
      params.precioOriginal =
        dto.precioOriginal ?? existingProducto?.getPrecioOriginal();
    }
    if (
      dto.videos !== undefined ||
      existingProducto?.getVideos() !== undefined
    ) {
      params.videos = dto.videos ?? existingProducto?.getVideos();
    }
    if (
      dto.manuales !== undefined ||
      existingProducto?.getManuales() !== undefined
    ) {
      params.manuales = dto.manuales ?? existingProducto?.getManuales();
    }

    return new Producto(params);
  }

  static mergeForUpdate(
    existingProducto: Producto,
    dto: UpdateProductoDTO
  ): Producto {
    return this.toEntity(dto, existingProducto);
  }

  static toDTO(producto: Producto): ProductoDTO {
    const informacionEnvio = producto.getInformacionEnvio();
    const especificaciones = producto.getEspecificaciones();

    // Filtrar valores undefined de las especificaciones y convertir arrays a strings
    const especificacionesFiltradas: {
      [key: string]: string | number | boolean;
    } = {};
    Object.entries(especificaciones).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          especificacionesFiltradas[key] = value.join(", ");
        } else {
          especificacionesFiltradas[key] = value;
        }
      }
    });

    const dtoParams: any = {
      id: producto.getId().getValue(),
      nombre: producto.getNombre(),
      descripcion: producto.getDescripcion(),
      precio: producto.getPrecio(),
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
      especificaciones: new EspecificacionesDTO(especificacionesFiltradas),
      caracteristicas: producto.getCaracteristicas(),
      imagenes: producto.getImagenes(),
      activo: producto.isActivo(),
      fechaCreacion: producto.getFechaCreacion(),
      fechaActualizacion: producto.getFechaActualizacion(),
    };

    // Manejar campos opcionales
    if (producto.getPrecioOriginal() !== undefined) {
      dtoParams.precioOriginal = producto.getPrecioOriginal();
    }
    if (producto.getVideos() !== undefined) {
      dtoParams.videos = producto.getVideos();
    }
    if (producto.getManuales() !== undefined) {
      dtoParams.manuales = producto.getManuales();
    }

    return new ProductoDTO(dtoParams);
  }
}
