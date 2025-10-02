import { IPort } from "@hex-lib/core";
import { Carrito } from "@/dashboard/domain/entities/carrito.entity";

export interface ICarritoPort extends IPort {
  createCarrito(carrito: Carrito): Promise<void>;
  getCarritoById(id: string): Promise<Carrito | null>;
  getCarritoByUsuario(usuarioId: string): Promise<Carrito | null>;
  updateCarrito(carrito: Carrito): Promise<void>;
  deleteCarrito(id: string): Promise<void>;
}
