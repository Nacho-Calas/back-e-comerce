import {
  CreateProductoDTO,
  ProductoDTO,
  UpdateProductoDTO,
} from "@/dashboard/application/dtos/producto.dto";
import { ProductoService } from "@/dashboard/application/services/producto.service";
import {
  IContextuable,
  ILoggeable,
  IThrowable,
  Controller,
  AdapterDecorator,
  type AdapterDependencies,
} from "@hex-lib/core";
import { CategoriaProductoEnum } from "@/dashboard/domain/enums/categoria_producto.enum";

export interface ProductoControllerDependencies
  extends Partial<AdapterDependencies> {
  services: {
    productoService: ProductoService;
  };
}

const productoControllerDependencies: ProductoControllerDependencies = {
  services: {
    productoService: new ProductoService(),
  },
};

@AdapterDecorator(productoControllerDependencies)
export class ProductoController
  extends Controller<ProductoControllerDependencies>
  implements IContextuable, IThrowable, ILoggeable
{
  /**
   * Crear un nuevo producto
   */
  async createProducto(createDTO: CreateProductoDTO): Promise<ProductoDTO> {
    this.getLogger().info({
      message: "Solicitud de creación de producto recibida",
      context: this.getContext(),
      metadata: { nombre: createDTO.nombre, categoria: createDTO.categoria },
    });

    const productoService = this.getService("productoService");
    const result = await productoService.createProducto(createDTO);

    this.getLogger().info({
      message: "Producto creado exitosamente",
      context: this.getContext(),
      metadata: { productoId: result.id },
    });

    return result;
  }

  /**
   * Obtener un producto por ID
   */
  async getProductoById(id: string): Promise<ProductoDTO | null> {
    this.getLogger().info({
      message: "Solicitud de obtención de producto por ID",
      context: this.getContext(),
      metadata: { productoId: id },
    });

    const productoService = this.getService("productoService");
    const result = await productoService.getProductoById(id);

    if (!result) {
      this.getLogger().warn({
        message: "Producto no encontrado",
        context: this.getContext(),
        metadata: { productoId: id },
      });
    }

    return result;
  }

  /**
   * Obtener todos los productos
   */
  async getAllProductos(
    includeInactive?: boolean
  ): Promise<ProductoDTO[] | null> {
    this.getLogger().info({
      message: "Solicitud de obtención de todos los productos",
      context: this.getContext(),
    });

    const productoService = this.getService("productoService");
    const result = await productoService.getAllProductos(includeInactive);

    this.getLogger().info({
      message: "Productos obtenidos exitosamente",
      context: this.getContext(),
      metadata: { count: result?.length || 0 },
    });

    return result;
  }

  /**
   * Obtener productos por categoría
   */
  async getProductosByCategoria(
    categoria: CategoriaProductoEnum,
    includeInactive?: boolean
  ): Promise<ProductoDTO[] | null> {
    this.getLogger().info({
      message: "Solicitud de obtención de productos por categoría",
      context: this.getContext(),
      metadata: { categoria },
    });

    const productoService = this.getService("productoService");
    const result = await productoService.getProductosByCategoria(
      categoria,
      includeInactive
    );

    this.getLogger().info({
      message: "Productos por categoría obtenidos exitosamente",
      context: this.getContext(),
      metadata: { categoria, count: result?.length || 0 },
    });

    return result;
  }

  /**
   * Obtener productos destacados
   */
  async getProductosDestacados(
    includeInactive?: boolean
  ): Promise<ProductoDTO[] | null> {
    this.getLogger().info({
      message: "Solicitud de obtención de productos destacados",
      context: this.getContext(),
    });

    const productoService = this.getService("productoService");
    const result = await productoService.getProductosDestacados(
      includeInactive
    );

    this.getLogger().info({
      message: "Productos destacados obtenidos exitosamente",
      context: this.getContext(),
      metadata: { count: result?.length || 0 },
    });

    return result;
  }

  /**
   * Buscar productos por término
   */
  async buscarProductos(
    termino: string,
    includeInactive?: boolean
  ): Promise<ProductoDTO[] | null> {
    this.getLogger().info({
      message: "Solicitud de búsqueda de productos",
      context: this.getContext(),
      metadata: { termino },
    });

    const productoService = this.getService("productoService");
    const result = await productoService.buscarProductos(
      termino,
      includeInactive
    );

    this.getLogger().info({
      message: "Búsqueda de productos completada",
      context: this.getContext(),
      metadata: { termino, count: result?.length || 0 },
    });

    return result;
  }

  /**
   * Actualizar un producto
   */
  async updateProducto(updateDTO: UpdateProductoDTO): Promise<void> {
    this.getLogger().info({
      message: "Solicitud de actualización de producto",
      context: this.getContext(),
      metadata: { productoId: updateDTO.id },
    });

    const productoService = this.getService("productoService");
    await productoService.updateProducto(updateDTO);

    this.getLogger().info({
      message: "Producto actualizado exitosamente",
      context: this.getContext(),
      metadata: { productoId: updateDTO.id },
    });
  }

  /**
   * Eliminar un producto (soft delete)
   */
  async deleteProducto(id: string): Promise<void> {
    this.getLogger().info({
      message: "Solicitud de eliminación de producto",
      context: this.getContext(),
      metadata: { productoId: id },
    });

    const productoService = this.getService("productoService");
    await productoService.deleteProducto(id);

    this.getLogger().info({
      message: "Producto eliminado exitosamente",
      context: this.getContext(),
      metadata: { productoId: id },
    });
  }

  /**
   * Eliminar un producto permanentemente
   */
  async hardDeleteProducto(id: string): Promise<void> {
    this.getLogger().info({
      message: "Solicitud de eliminación permanente de producto",
      context: this.getContext(),
      metadata: { productoId: id },
    });

    const productoService = this.getService("productoService");
    await productoService.hardDeleteProducto(id);

    this.getLogger().info({
      message: "Producto eliminado permanentemente",
      context: this.getContext(),
      metadata: { productoId: id },
    });
  }

  /**
   * Obtener categorías disponibles
   */
  async getCategorias(): Promise<{ value: string; label: string }[]> {
    this.getLogger().info({
      message: "Solicitud de obtención de categorías",
      context: this.getContext(),
    });

    const productoService = this.getService("productoService");
    const result = await productoService.getCategorias();

    this.getLogger().info({
      message: "Categorías obtenidas exitosamente",
      context: this.getContext(),
      metadata: { count: result.length },
    });

    return result;
  }
}
