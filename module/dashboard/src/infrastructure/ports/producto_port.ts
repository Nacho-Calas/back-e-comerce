import { IPort } from "@hex-lib/core";
import { Producto } from "@/dashboard/domain/entities/producto.entity";
import { CategoriaProductoEnum } from "@/dashboard/domain/enums/categoria_producto.enum";

export interface IProductoPort extends IPort {
  createProducto(producto: Producto): Promise<void>;
  getProductoById(id: string): Promise<Producto | null>;
  getAllProductos(includeInactive?: boolean): Promise<Producto[] | null>;
  getProductosByCategoria(
    categoria: CategoriaProductoEnum,
    includeInactive?: boolean
  ): Promise<Producto[] | null>;
  getProductosDestacados(includeInactive?: boolean): Promise<Producto[] | null>;
  buscarProductos(
    termino: string,
    includeInactive?: boolean
  ): Promise<Producto[] | null>;
  updateProducto(producto: Producto): Promise<void>;
  deleteProducto(id: string): Promise<void>;
  hardDeleteProducto(id: string): Promise<void>;
}
