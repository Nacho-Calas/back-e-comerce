import {
  Service,
  ServiceDecorator,
  type ServiceDependencies,
  IContextuable,
  ILoggeable,
  IThrowable,
} from "@hex-lib/core";
import { Carrito } from "@/dashboard/domain/entities/carrito.entity";
import { CarritoMapper } from "@/dashboard/application/mappers/carrito.mapper";
import {
  CreateCarritoDTO,
  AgregarItemCarritoDTO,
  ActualizarCantidadItemDTO,
  EliminarItemCarritoDTO,
  CarritoDTO,
} from "@/dashboard/application/dtos/carrito.dto";
import { ICarritoPort } from "@/dashboard/infrastructure/ports/carrito_port";
import { IProductoPort } from "@/dashboard/infrastructure/ports/producto_port";
import { DynamoDBCarritoAdapter } from "@/dashboard/infrastructure/adapters/dynamodb-carrito.adapter";
import { DynamoDBProductoAdapter } from "@/dashboard/infrastructure/adapters/dynamodb-producto.adapter";

interface CarritoServiceDependencies extends Partial<ServiceDependencies> {
  ports: {
    carritoPort: ICarritoPort;
    productoPort: IProductoPort;
  };
}

const carritoServiceDependencies: CarritoServiceDependencies = {
  ports: {
    carritoPort: new DynamoDBCarritoAdapter(),
    productoPort: new DynamoDBProductoAdapter(),
  },
};

@ServiceDecorator(carritoServiceDependencies)
export class CarritoService
  extends Service<CarritoServiceDependencies>
  implements IContextuable, ILoggeable, IThrowable
{
  /**
   * Crear un nuevo carrito
   */
  async createCarrito(dto: CreateCarritoDTO): Promise<CarritoDTO> {
    this.getLogger().info({
      message: "Creando nuevo carrito",
      context: this.getContext(),
      metadata: { sessionId: dto.sessionId },
    });

    const carritoPort = this.getPort("carritoPort");
    const carrito = new Carrito({
      id: require("@hex-lib/core").UUID.create(),
      sessionId: dto.sessionId,
      items:
        dto.items?.map((item: any) => ({
          productoId: item.productoId,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
          imagen: item.imagen,
          especificaciones: item.especificaciones,
        })) || [],
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    });

    await carritoPort.createCarrito(carrito);

    this.getLogger().info({
      message: "Carrito creado exitosamente",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });

    return CarritoMapper.toDTO(carrito);
  }

  /**
   * Obtener carrito por ID
   */
  async getCarritoById(id: string): Promise<CarritoDTO | null> {
    this.getLogger().info({
      message: "Obteniendo carrito por ID",
      context: this.getContext(),
      metadata: { carritoId: id },
    });

    const carritoPort = this.getPort("carritoPort");
    const carrito = await carritoPort.getCarritoById(id);

    if (!carrito) {
      return null;
    }

    this.getLogger().info({
      message: "Carrito obtenido exitosamente",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });

    return CarritoMapper.toDTO(carrito);
  }

  /**
   * Obtener carrito por sesión (usando sessionId como identificador)
   */
  async getCarritoBySession(sessionId: string): Promise<CarritoDTO | null> {
    this.getLogger().info({
      message: "Obteniendo carrito por sesión",
      context: this.getContext(),
      metadata: { sessionId },
    });

    const carritoPort = this.getPort("carritoPort");
    const carrito = await carritoPort.getCarritoBySession(sessionId);

    if (!carrito) {
      return null;
    }

    this.getLogger().info({
      message: "Carrito obtenido exitosamente",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });

    return CarritoMapper.toDTO(carrito);
  }

  /**
   * Agregar item al carrito
   */
  async agregarItem(dto: AgregarItemCarritoDTO): Promise<CarritoDTO> {
    this.getLogger().info({
      message: "Agregando item al carrito",
      context: this.getContext(),
      metadata: { carritoId: dto.carritoId, productoId: dto.item.productoId },
    });

    const carritoPort = this.getPort("carritoPort");
    const productoPort = this.getPort("productoPort");

    // Verificar que el producto existe y está disponible
    const producto = await productoPort.getProductoById(dto.item.productoId);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    if (!producto.isDisponible()) {
      throw new Error("Producto no disponible");
    }

    if (producto.getStock() < dto.item.cantidad) {
      throw new Error("Stock insuficiente");
    }

    // Obtener o crear carrito
    let carrito = await carritoPort.getCarritoById(dto.carritoId);
    if (!carrito) {
      throw new Error("Carrito no encontrado");
    }

    // Agregar item al carrito
    carrito.agregarItem({
      productoId: dto.item.productoId,
      nombre: producto.getNombre(),
      precio: producto.getPrecio(),
      cantidad: dto.item.cantidad,
      imagen: producto.getImagenes()[0],
      especificaciones: producto.getEspecificaciones() as {
        [key: string]: string | number | boolean;
      },
    });

    // Actualizar carrito en la base de datos
    await carritoPort.updateCarrito(carrito);

    this.getLogger().info({
      message: "Item agregado al carrito exitosamente",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });

    return CarritoMapper.toDTO(carrito);
  }

  /**
   * Actualizar cantidad de un item en el carrito
   */
  async actualizarCantidad(
    dto: ActualizarCantidadItemDTO
  ): Promise<CarritoDTO> {
    this.getLogger().info({
      message: "Actualizando cantidad de item en carrito",
      context: this.getContext(),
      metadata: { carritoId: dto.carritoId, productoId: dto.productoId },
    });

    const carritoPort = this.getPort("carritoPort");
    const productoPort = this.getPort("productoPort");

    // Obtener carrito
    const carrito = await carritoPort.getCarritoById(dto.carritoId);
    if (!carrito) {
      throw new Error("Carrito no encontrado");
    }

    // Si la cantidad es 0, eliminar el item
    if (dto.cantidad === 0) {
      carrito.eliminarItem(dto.productoId);
    } else {
      // Verificar stock disponible
      const producto = await productoPort.getProductoById(dto.productoId);
      if (producto && producto.getStock() < dto.cantidad) {
        throw new Error("Stock insuficiente");
      }

      carrito.actualizarCantidad(dto.productoId, dto.cantidad);
    }

    // Actualizar carrito en la base de datos
    await carritoPort.updateCarrito(carrito);

    this.getLogger().info({
      message: "Cantidad actualizada exitosamente",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });

    return CarritoMapper.toDTO(carrito);
  }

  /**
   * Eliminar item del carrito
   */
  async eliminarItem(dto: EliminarItemCarritoDTO): Promise<CarritoDTO> {
    this.getLogger().info({
      message: "Eliminando item del carrito",
      context: this.getContext(),
      metadata: { carritoId: dto.carritoId, productoId: dto.productoId },
    });

    const carritoPort = this.getPort("carritoPort");

    // Obtener carrito
    const carrito = await carritoPort.getCarritoById(dto.carritoId);
    if (!carrito) {
      throw new Error("Carrito no encontrado");
    }

    // Eliminar item
    carrito.eliminarItem(dto.productoId);

    // Actualizar carrito en la base de datos
    await carritoPort.updateCarrito(carrito);

    this.getLogger().info({
      message: "Item eliminado del carrito exitosamente",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });

    return CarritoMapper.toDTO(carrito);
  }

  /**
   * Limpiar carrito
   */
  async limpiarCarrito(carritoId: string): Promise<CarritoDTO> {
    this.getLogger().info({
      message: "Limpiando carrito",
      context: this.getContext(),
      metadata: { carritoId },
    });

    const carritoPort = this.getPort("carritoPort");

    // Obtener carrito
    const carrito = await carritoPort.getCarritoById(carritoId);
    if (!carrito) {
      throw new Error("Carrito no encontrado");
    }

    // Limpiar carrito
    carrito.limpiar();

    // Actualizar carrito en la base de datos
    await carritoPort.updateCarrito(carrito);

    this.getLogger().info({
      message: "Carrito limpiado exitosamente",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });

    return CarritoMapper.toDTO(carrito);
  }
}
