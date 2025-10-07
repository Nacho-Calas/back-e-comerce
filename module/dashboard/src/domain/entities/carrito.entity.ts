import { UUID } from "@hex-lib/core";

type ItemCarrito = {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string | null;
  especificaciones: { [key: string]: string | number | boolean } | null;
};

type CarritoConstructorParams = {
  id: UUID;
  sessionId: string;
  items: ItemCarrito[];
  fechaCreacion: string;
  fechaActualizacion: string;
};

export class Carrito {
  private id: UUID;
  private sessionId: string;
  private items: ItemCarrito[];
  private fechaCreacion: string;
  private fechaActualizacion: string;

  constructor(params: CarritoConstructorParams) {
    this.id = params.id;
    this.sessionId = params.sessionId;
    this.items = params.items;
    this.fechaCreacion = params.fechaCreacion;
    this.fechaActualizacion = params.fechaActualizacion;
  }

  // Getters
  getId(): UUID {
    return this.id;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getItems(): ItemCarrito[] {
    return this.items;
  }

  getFechaCreacion(): string {
    return this.fechaCreacion;
  }

  getFechaActualizacion(): string {
    return this.fechaActualizacion;
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  getSubtotal(): number {
    return this.items.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  }

  getSubtotalFormateado(): string {
    return `$${(this.getSubtotal() / 100).toFixed(2)}`;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Métodos de gestión de items
  agregarItem(item: ItemCarrito): void {
    const itemExistente = this.items.find(
      (i) => i.productoId === item.productoId
    );

    if (itemExistente) {
      itemExistente.cantidad += item.cantidad;
    } else {
      this.items.push(item);
    }

    this.fechaActualizacion = new Date().toISOString();
  }

  actualizarCantidad(productoId: string, cantidad: number): void {
    const item = this.items.find((i) => i.productoId === productoId);

    if (item) {
      if (cantidad <= 0) {
        this.eliminarItem(productoId);
      } else {
        item.cantidad = cantidad;
        this.fechaActualizacion = new Date().toISOString();
      }
    }
  }

  eliminarItem(productoId: string): void {
    this.items = this.items.filter((item) => item.productoId !== productoId);
    this.fechaActualizacion = new Date().toISOString();
  }

  limpiar(): void {
    this.items = [];
    this.fechaActualizacion = new Date().toISOString();
  }

  getItem(productoId: string): ItemCarrito | undefined {
    return this.items.find((item) => item.productoId === productoId);
  }

  // Setters
  setId(id: UUID): void {
    this.id = id;
  }

  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  setItems(items: ItemCarrito[]): void {
    this.items = items;
    this.fechaActualizacion = new Date().toISOString();
  }

  setFechaActualizacion(fecha: string): void {
    this.fechaActualizacion = fecha;
  }
}
