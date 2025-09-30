import {
  CreateProductoDTO,
  ProductoDTO,
  UpdateProductoDTO,
} from "@/dashboard/application/dtos/producto.dto";
import { ProductoNotFoundException } from "@/dashboard/application/exceptions/producto_not_found.exception";
import { ProductoFactory } from "@/dashboard/application/factories/producto.factory";
import { ProductoMapper } from "@/dashboard/application/mappers/producto.mapper";
import { DynamoDBProductoAdapter } from "@/dashboard/infrastructure/adapters/dynamodb-producto.adapter";
import { IProductoPort } from "@/dashboard/infrastructure/ports/producto_port";
import {
  IContextuable,
  ILoggeable,
  IThrowable,
  Service,
  ServiceDecorator,
  type ServiceDependencies,
} from "@hex-lib/core";
import { CategoriaProductoEnum } from "@/dashboard/domain/enums/categoria_producto.enum";

interface ProductoServiceDependencies extends Partial<ServiceDependencies> {
  ports: {
    productoPort: IProductoPort;
  };
}

const productoServiceDependencies: ProductoServiceDependencies = {
  ports: {
    productoPort: new DynamoDBProductoAdapter(),
  },
};

@ServiceDecorator(productoServiceDependencies)
export class ProductoService
  extends Service<ProductoServiceDependencies>
  implements IContextuable, IThrowable, ILoggeable
{
  /**
   * Crear un nuevo producto
   */
  async createProducto(dto: CreateProductoDTO): Promise<ProductoDTO> {
    this.getLogger().info({
      message: "Iniciando creación de producto",
      context: this.getContext(),
      metadata: { nombre: dto.nombre, categoria: dto.categoria },
    });

    const productoPort = this.getPort("productoPort");
    const producto = ProductoFactory.create(dto);
    await productoPort.createProducto(producto);

    this.getLogger().info({
      message: "Producto creado exitosamente",
      context: this.getContext(),
      metadata: { productoId: producto.getId().getValue() },
    });

    return ProductoMapper.toDTO(producto);
  }

  /**
   * Obtener un producto por ID
   */
  async getProductoById(id: string): Promise<ProductoDTO | null> {
    this.getLogger().info({
      message: "Iniciando obtención de producto por ID",
      context: this.getContext(),
      metadata: { productoId: id },
    });

    const productoPort = this.getPort("productoPort");
    const producto = await productoPort.getProductoById(id);

    if (!producto) {
      return null;
    }

    this.getLogger().info({
      message: "Producto obtenido exitosamente",
      context: this.getContext(),
      metadata: { productoId: producto?.getId().getValue() },
    });

    return ProductoMapper.toDTO(producto);
  }

  /**
   * Obtener todos los productos
   */
  async getAllProductos(): Promise<ProductoDTO[] | null> {
    this.getLogger().info({
      message: "Iniciando obtención de todos los productos",
      context: this.getContext(),
    });

    const productoPort = this.getPort("productoPort");
    const productos = await productoPort.getAllProductos();

    if (!productos) {
      return null;
    }

    this.getLogger().info({
      message: "Productos obtenidos exitosamente",
      context: this.getContext(),
      metadata: { count: productos.length },
    });

    const productosDTO = productos.map((producto) =>
      ProductoMapper.toDTO(producto)
    );

    return productosDTO;
  }

  /**
   * Obtener productos por categoría
   */
  async getProductosByCategoria(
    categoria: CategoriaProductoEnum
  ): Promise<ProductoDTO[] | null> {
    this.getLogger().info({
      message: "Iniciando obtención de productos por categoría",
      context: this.getContext(),
      metadata: { categoria },
    });

    const productoPort = this.getPort("productoPort");
    const productos = await productoPort.getProductosByCategoria(categoria);

    if (!productos) {
      return null;
    }

    this.getLogger().info({
      message: "Productos por categoría obtenidos exitosamente",
      context: this.getContext(),
      metadata: { categoria, count: productos.length },
    });

    const productosDTO = productos.map((producto) =>
      ProductoMapper.toDTO(producto)
    );

    return productosDTO;
  }

  /**
   * Obtener productos destacados
   */
  async getProductosDestacados(): Promise<ProductoDTO[] | null> {
    this.getLogger().info({
      message: "Iniciando obtención de productos destacados",
      context: this.getContext(),
    });

    const productoPort = this.getPort("productoPort");
    const productos = await productoPort.getProductosDestacados();

    if (!productos) {
      return null;
    }

    this.getLogger().info({
      message: "Productos destacados obtenidos exitosamente",
      context: this.getContext(),
      metadata: { count: productos.length },
    });

    const productosDTO = productos.map((producto) =>
      ProductoMapper.toDTO(producto)
    );

    return productosDTO;
  }

  /**
   * Buscar productos por término
   */
  async buscarProductos(termino: string): Promise<ProductoDTO[] | null> {
    this.getLogger().info({
      message: "Iniciando búsqueda de productos",
      context: this.getContext(),
      metadata: { termino },
    });

    const productoPort = this.getPort("productoPort");
    const productos = await productoPort.buscarProductos(termino);

    if (!productos) {
      return null;
    }

    this.getLogger().info({
      message: "Búsqueda de productos completada exitosamente",
      context: this.getContext(),
      metadata: { termino, count: productos.length },
    });

    const productosDTO = productos.map((producto) =>
      ProductoMapper.toDTO(producto)
    );

    return productosDTO;
  }

  /**
   * Actualizar un producto
   */
  async updateProducto(dto: UpdateProductoDTO): Promise<void> {
    this.getLogger().info({
      message: "Iniciando actualización de producto",
      context: this.getContext(),
      metadata: { productoId: dto.id },
    });

    const existingProducto = await this.getProductoById(dto.id);
    if (!existingProducto) {
      throw new ProductoNotFoundException(dto.id);
    }

    // Convertir el DTO existente a entidad para poder hacer merge
    const existingProductoEntity = await this.getPort(
      "productoPort"
    ).getProductoById(dto.id);
    if (!existingProductoEntity) {
      throw new ProductoNotFoundException(dto.id);
    }

    const updateProducto = ProductoMapper.mergeForUpdate(
      existingProductoEntity,
      dto
    );
    await this.getPort("productoPort").updateProducto(updateProducto);

    this.getLogger().info({
      message: "Producto actualizado exitosamente",
      context: this.getContext(),
      metadata: { productoId: dto.id },
    });
  }

  /**
   * Eliminar un producto (soft delete)
   */
  async deleteProducto(id: string): Promise<void> {
    this.getLogger().info({
      message: "Iniciando eliminación de producto (soft delete)",
      context: this.getContext(),
      metadata: { productoId: id },
    });

    const productoPort = this.getPort("productoPort");
    await productoPort.deleteProducto(id);

    this.getLogger().info({
      message: "Producto eliminado exitosamente (soft delete)",
      context: this.getContext(),
      metadata: { productoId: id },
    });
  }

  /**
   * Eliminar un producto permanentemente
   */
  async hardDeleteProducto(id: string): Promise<void> {
    this.getLogger().info({
      message: "Iniciando eliminación permanente de producto",
      context: this.getContext(),
      metadata: { productoId: id },
    });

    const productoPort = this.getPort("productoPort");
    await productoPort.hardDeleteProducto(id);

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
      message: "Obteniendo categorías disponibles",
      context: this.getContext(),
    });

    const categorias = Object.values(CategoriaProductoEnum).map(
      (categoria) => ({
        value: categoria,
        label: categoria,
      })
    );

    this.getLogger().info({
      message: "Categorías obtenidas exitosamente",
      context: this.getContext(),
      metadata: { count: categorias.length },
    });

    return categorias;
  }
}
