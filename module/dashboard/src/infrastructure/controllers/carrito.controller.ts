import {
  CreateCarritoDTO,
  UpdateCarritoDTO,
  AgregarItemCarritoDTO,
  ActualizarCantidadItemDTO,
  EliminarItemCarritoDTO,
  CarritoDTO,
} from "@/dashboard/application/dtos/carrito.dto";
import { CarritoService } from "@/dashboard/application/services/carrito.service";
import {
  IContextuable,
  ILoggeable,
  IThrowable,
  Controller,
  AdapterDecorator,
  type AdapterDependencies,
} from "@hex-lib/core";

export interface CarritoControllerDependencies
  extends Partial<AdapterDependencies> {
  services: {
    carritoService: CarritoService;
  };
}

const carritoControllerDependencies: CarritoControllerDependencies = {
  services: {
    carritoService: new CarritoService(),
  },
};

@AdapterDecorator(carritoControllerDependencies)
export class CarritoController
  extends Controller<CarritoControllerDependencies>
  implements IContextuable, IThrowable, ILoggeable
{
  /**
   * Crear un nuevo carrito
   */
  async createCarrito(createDTO: CreateCarritoDTO): Promise<CarritoDTO> {
    this.getLogger().info({
      message: "Solicitud de creación de carrito recibida",
      context: this.getContext(),
      metadata: { usuarioId: createDTO.usuarioId },
    });

    const carritoService = this.getService("carritoService");
    const result = await carritoService.createCarrito(createDTO);

    this.getLogger().info({
      message: "Carrito creado exitosamente",
      context: this.getContext(),
      metadata: { carritoId: result.id },
    });

    return result;
  }

  /**
   * Obtener carrito por ID
   */
  async getCarritoById(id: string): Promise<CarritoDTO | null> {
    this.getLogger().info({
      message: "Solicitud de obtención de carrito por ID",
      context: this.getContext(),
      metadata: { carritoId: id },
    });

    const carritoService = this.getService("carritoService");
    const result = await carritoService.getCarritoById(id);

    if (!result) {
      this.getLogger().warn({
        message: "Carrito no encontrado",
        context: this.getContext(),
        metadata: { carritoId: id },
      });
    }

    return result;
  }

  /**
   * Obtener carrito por usuario (sessionId)
   */
  async getCarritoByUsuario(usuarioId: string): Promise<CarritoDTO | null> {
    this.getLogger().info({
      message: "Solicitud de obtención de carrito por usuario",
      context: this.getContext(),
      metadata: { usuarioId },
    });

    const carritoService = this.getService("carritoService");
    const result = await carritoService.getCarritoByUsuario(usuarioId);

    if (!result) {
      this.getLogger().warn({
        message: "Carrito no encontrado para usuario",
        context: this.getContext(),
        metadata: { usuarioId },
      });
    }

    return result;
  }

  /**
   * Agregar item al carrito
   */
  async agregarItem(agregarDTO: AgregarItemCarritoDTO): Promise<CarritoDTO> {
    this.getLogger().info({
      message: "Solicitud de agregar item al carrito",
      context: this.getContext(),
      metadata: {
        carritoId: agregarDTO.carritoId,
        productoId: agregarDTO.item.productoId,
      },
    });

    const carritoService = this.getService("carritoService");
    const result = await carritoService.agregarItem(agregarDTO);

    this.getLogger().info({
      message: "Item agregado al carrito exitosamente",
      context: this.getContext(),
      metadata: { carritoId: result.id },
    });

    return result;
  }

  /**
   * Actualizar cantidad de item en el carrito
   */
  async actualizarCantidad(
    actualizarDTO: ActualizarCantidadItemDTO
  ): Promise<CarritoDTO> {
    this.getLogger().info({
      message: "Solicitud de actualización de cantidad de item",
      context: this.getContext(),
      metadata: {
        carritoId: actualizarDTO.carritoId,
        productoId: actualizarDTO.productoId,
        cantidad: actualizarDTO.cantidad,
      },
    });

    const carritoService = this.getService("carritoService");
    const result = await carritoService.actualizarCantidad(actualizarDTO);

    this.getLogger().info({
      message: "Cantidad actualizada exitosamente",
      context: this.getContext(),
      metadata: { carritoId: result.id },
    });

    return result;
  }

  /**
   * Eliminar item del carrito
   */
  async eliminarItem(eliminarDTO: EliminarItemCarritoDTO): Promise<CarritoDTO> {
    this.getLogger().info({
      message: "Solicitud de eliminación de item del carrito",
      context: this.getContext(),
      metadata: {
        carritoId: eliminarDTO.carritoId,
        productoId: eliminarDTO.productoId,
      },
    });

    const carritoService = this.getService("carritoService");
    const result = await carritoService.eliminarItem(eliminarDTO);

    this.getLogger().info({
      message: "Item eliminado del carrito exitosamente",
      context: this.getContext(),
      metadata: { carritoId: result.id },
    });

    return result;
  }

  /**
   * Limpiar carrito
   */
  async limpiarCarrito(carritoId: string): Promise<CarritoDTO> {
    this.getLogger().info({
      message: "Solicitud de limpieza de carrito",
      context: this.getContext(),
      metadata: { carritoId },
    });

    const carritoService = this.getService("carritoService");
    const result = await carritoService.limpiarCarrito(carritoId);

    this.getLogger().info({
      message: "Carrito limpiado exitosamente",
      context: this.getContext(),
      metadata: { carritoId: result.id },
    });

    return result;
  }
}
