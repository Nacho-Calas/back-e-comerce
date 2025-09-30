import { IPort } from "@hex-lib/core";
import { Producto } from "@/dashboard/src/domain/entities/producto.entity";
import { CategoriaProductoEnum } from "@/dashboard/src/domain/enums/categoria_producto.enum";

export interface IProductoPort extends IPort {
  createProducto(producto: Producto): Promise<void>;
  getProductoById(id: string): Promise<Producto | null>;
  getAllProductos(): Promise<Producto[] | null>;
  getProductosByCategoria(
    categoria: CategoriaProductoEnum
  ): Promise<Producto[] | null>;
  getProductosDestacados(): Promise<Producto[] | null>;
  buscarProductos(termino: string): Promise<Producto[] | null>;
  updateProducto(producto: Producto): Promise<void>;
  deleteProducto(id: string): Promise<void>;
  hardDeleteProducto(id: string): Promise<void>;
}
