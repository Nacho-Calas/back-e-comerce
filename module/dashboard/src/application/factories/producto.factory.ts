import { Producto } from "@/dashboard/domain/entities/producto.entity";
import { CreateProductoDTO } from "../dtos/producto.dto";
import { UUID } from "@hex-lib/core";

export class ProductoFactory {
  static create(dto: CreateProductoDTO): Producto {
    try {
      console.log("=== PRODUCTO FACTORY - CREATE ===");
      console.log("DTO received in factory:", JSON.stringify({
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        precio: dto.precio,
        precioOriginal: dto.precioOriginal,
        estado: dto.estado,
        categoria: dto.categoria,
        destacado: dto.destacado,
        stock: dto.stock,
        stockMinimo: dto.stockMinimo,
        activo: dto.activo
      }, null, 2));

      console.log("Creating UUID...");
      const id = UUID.create();
      console.log("UUID created:", id.getValue());

      console.log("Validating required fields...");
      if (!dto.nombre) {
        throw new Error("Nombre is required");
      }
      if (!dto.descripcion) {
        throw new Error("Descripcion is required");
      }
      if (dto.precio === undefined || dto.precio === null) {
        throw new Error("Precio is required");
      }
      if (!dto.estado) {
        throw new Error("Estado is required");
      }
      if (!dto.categoria) {
        throw new Error("Categoria is required");
      }
      if (!dto.informacionEnvio) {
        throw new Error("InformacionEnvio is required");
      }
      if (dto.destacado === undefined || dto.destacado === null) {
        throw new Error("Destacado is required");
      }
      if (dto.stock === undefined || dto.stock === null) {
        throw new Error("Stock is required");
      }
      if (dto.stockMinimo === undefined || dto.stockMinimo === null) {
        throw new Error("StockMinimo is required");
      }
      if (dto.activo === undefined || dto.activo === null) {
        throw new Error("Activo is required");
      }

      console.log("All required fields validated successfully");

      console.log("Creating Producto entity...");
      const producto = new Producto({
        id: id,
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

      console.log("Producto entity created successfully:", JSON.stringify({
        id: producto.getId().getValue(),
        nombre: producto.getNombre(),
        categoria: producto.getCategoria(),
        precio: producto.getPrecio()
      }, null, 2));

      console.log("=== PRODUCTO FACTORY - SUCCESS ===");
      return producto;
    } catch (error) {
      console.log("=== PRODUCTO FACTORY - ERROR ===");
      console.error("Error in ProductoFactory.create:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'Unknown error type'
      });
      throw error;
    }
  }
}
