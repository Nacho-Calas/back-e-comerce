import { Producto } from "@/dashboard/domain/entities/producto.entity";
import { CreateProductoDTO } from "../dtos/producto.dto";
import { UUID } from "@hex-lib/core";

export class ProductoFactory {
  static create(dto: CreateProductoDTO): Producto {
    return new Producto({
      id: UUID.create(),
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precio: dto.precio,
      precioOriginal: dto.precioOriginal,
      estado: dto.estado,
      categoria: dto.categoria,
      informacionEnvio: dto.informacionEnvio,
      destacado: dto.destacado,
      stock: dto.stock,
      stockMinimo: dto.stockMinimo,
      especificaciones: dto.especificaciones || {},
      caracteristicas: dto.caracteristicas || [],
      imagenes: dto.imagenes || [],
      videos: dto.videos,
      manuales: dto.manuales,
      activo: dto.activo,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    });
  }
}
