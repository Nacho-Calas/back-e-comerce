import { UUID } from "@hex-lib/core";
import { EstadoOrdenEnum } from "@/dashboard/domain/enums/estado_orden.enum";
import { MetodoPagoEnum } from "@/dashboard/domain/enums/metodo_pago.enum";

type ItemOrden = {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  especificaciones?: { [key: string]: string | number | boolean };
};

type DireccionEnvio = {
  nombre: string;
  apellido: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  telefono: string;
  email: string;
  instrucciones?: string;
};

type InformacionPago = {
  metodo: MetodoPagoEnum;
  numeroTarjeta?: string; // Solo los últimos 4 dígitos
  fechaVencimiento?: string;
  nombreTitular?: string;
  transaccionId?: string;
};

type OrdenConstructorParams = {
  id: UUID;
  numeroOrden: string;
  usuarioId: string;
  items: ItemOrden[];
  direccionEnvio: DireccionEnvio;
  informacionPago: InformacionPago;
  subtotal: number;
  costoEnvio: number;
  descuento: number;
  total: number;
  estado: EstadoOrdenEnum;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaEnvio?: string;
  fechaEntrega?: string;
  numeroSeguimiento?: string;
  notas?: string;
};

export class Orden {
  private id: UUID;
  private numeroOrden: string;
  private usuarioId: string;
  private items: ItemOrden[];
  private direccionEnvio: DireccionEnvio;
  private informacionPago: InformacionPago;
  private subtotal: number;
  private costoEnvio: number;
  private descuento: number;
  private total: number;
  private estado: EstadoOrdenEnum;
  private fechaCreacion: string;
  private fechaActualizacion: string;
  private fechaEnvio?: string;
  private fechaEntrega?: string;
  private numeroSeguimiento?: string;
  private notas?: string;

  constructor(params: OrdenConstructorParams) {
    this.id = params.id;
    this.numeroOrden = params.numeroOrden;
    this.usuarioId = params.usuarioId;
    this.items = params.items;
    this.direccionEnvio = params.direccionEnvio;
    this.informacionPago = params.informacionPago;
    this.subtotal = params.subtotal;
    this.costoEnvio = params.costoEnvio;
    this.descuento = params.descuento;
    this.total = params.total;
    this.estado = params.estado;
    this.fechaCreacion = params.fechaCreacion;
    this.fechaActualizacion = params.fechaActualizacion;
    this.fechaEnvio = params.fechaEnvio;
    this.fechaEntrega = params.fechaEntrega;
    this.numeroSeguimiento = params.numeroSeguimiento;
    this.notas = params.notas;
  }

  // Getters
  getId(): UUID {
    return this.id;
  }

  getNumeroOrden(): string {
    return this.numeroOrden;
  }

  getUsuarioId(): string {
    return this.usuarioId;
  }

  getItems(): ItemOrden[] {
    return this.items;
  }

  getDireccionEnvio(): DireccionEnvio {
    return this.direccionEnvio;
  }

  getInformacionPago(): InformacionPago {
    return this.informacionPago;
  }

  getSubtotal(): number {
    return this.subtotal;
  }

  getCostoEnvio(): number {
    return this.costoEnvio;
  }

  getDescuento(): number {
    return this.descuento;
  }

  getTotal(): number {
    return this.total;
  }

  getEstado(): EstadoOrdenEnum {
    return this.estado;
  }

  getFechaCreacion(): string {
    return this.fechaCreacion;
  }

  getFechaActualizacion(): string {
    return this.fechaActualizacion;
  }

  getFechaEnvio(): string | undefined {
    return this.fechaEnvio;
  }

  getFechaEntrega(): string | undefined {
    return this.fechaEntrega;
  }

  getNumeroSeguimiento(): string | undefined {
    return this.numeroSeguimiento;
  }

  getNotas(): string | undefined {
    return this.notas;
  }

  // Métodos de formateo
  getSubtotalFormateado(): string {
    return `$${(this.subtotal / 100).toFixed(2)}`;
  }

  getCostoEnvioFormateado(): string {
    return `$${(this.costoEnvio / 100).toFixed(2)}`;
  }

  getDescuentoFormateado(): string {
    return `$${(this.descuento / 100).toFixed(2)}`;
  }

  getTotalFormateado(): string {
    return `$${(this.total / 100).toFixed(2)}`;
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  // Métodos de estado
  puedeCancelar(): boolean {
    return [EstadoOrdenEnum.PENDIENTE, EstadoOrdenEnum.CONFIRMADA].includes(
      this.estado
    );
  }

  puedeDevolver(): boolean {
    return this.estado === EstadoOrdenEnum.ENTREGADA;
  }

  // Setters
  setId(id: UUID): void {
    this.id = id;
  }

  setNumeroOrden(numeroOrden: string): void {
    this.numeroOrden = numeroOrden;
  }

  setUsuarioId(usuarioId: string): void {
    this.usuarioId = usuarioId;
  }

  setItems(items: ItemOrden[]): void {
    this.items = items;
    this.fechaActualizacion = new Date().toISOString();
  }

  setDireccionEnvio(direccionEnvio: DireccionEnvio): void {
    this.direccionEnvio = direccionEnvio;
    this.fechaActualizacion = new Date().toISOString();
  }

  setInformacionPago(informacionPago: InformacionPago): void {
    this.informacionPago = informacionPago;
    this.fechaActualizacion = new Date().toISOString();
  }

  setSubtotal(subtotal: number): void {
    this.subtotal = subtotal;
    this.fechaActualizacion = new Date().toISOString();
  }

  setCostoEnvio(costoEnvio: number): void {
    this.costoEnvio = costoEnvio;
    this.fechaActualizacion = new Date().toISOString();
  }

  setDescuento(descuento: number): void {
    this.descuento = descuento;
    this.fechaActualizacion = new Date().toISOString();
  }

  setTotal(total: number): void {
    this.total = total;
    this.fechaActualizacion = new Date().toISOString();
  }

  setEstado(estado: EstadoOrdenEnum): void {
    this.estado = estado;
    this.fechaActualizacion = new Date().toISOString();
  }

  setFechaEnvio(fechaEnvio: string): void {
    this.fechaEnvio = fechaEnvio;
    this.fechaActualizacion = new Date().toISOString();
  }

  setFechaEntrega(fechaEntrega: string): void {
    this.fechaEntrega = fechaEntrega;
    this.fechaActualizacion = new Date().toISOString();
  }

  setNumeroSeguimiento(numeroSeguimiento: string): void {
    this.numeroSeguimiento = numeroSeguimiento;
    this.fechaActualizacion = new Date().toISOString();
  }

  setNotas(notas: string): void {
    this.notas = notas;
    this.fechaActualizacion = new Date().toISOString();
  }

  setFechaActualizacion(fecha: string): void {
    this.fechaActualizacion = fecha;
  }

  // Métodos de transición de estado
  confirmar(): void {
    if (this.estado !== EstadoOrdenEnum.PENDIENTE) {
      throw new Error("Solo se pueden confirmar órdenes pendientes");
    }
    this.estado = EstadoOrdenEnum.CONFIRMADA;
    this.fechaActualizacion = new Date().toISOString();
  }

  procesar(): void {
    if (this.estado !== EstadoOrdenEnum.CONFIRMADA) {
      throw new Error("Solo se pueden procesar órdenes confirmadas");
    }
    this.estado = EstadoOrdenEnum.EN_PROCESO;
    this.fechaActualizacion = new Date().toISOString();
  }

  enviar(numeroSeguimiento: string): void {
    if (this.estado !== EstadoOrdenEnum.EN_PROCESO) {
      throw new Error("Solo se pueden enviar órdenes en proceso");
    }
    this.estado = EstadoOrdenEnum.ENVIADA;
    this.numeroSeguimiento = numeroSeguimiento;
    this.fechaEnvio = new Date().toISOString();
    this.fechaActualizacion = new Date().toISOString();
  }

  entregar(): void {
    if (this.estado !== EstadoOrdenEnum.ENVIADA) {
      throw new Error("Solo se pueden entregar órdenes enviadas");
    }
    this.estado = EstadoOrdenEnum.ENTREGADA;
    this.fechaEntrega = new Date().toISOString();
    this.fechaActualizacion = new Date().toISOString();
  }

  cancelar(): void {
    if (!this.puedeCancelar()) {
      throw new Error("No se puede cancelar esta orden en su estado actual");
    }
    this.estado = EstadoOrdenEnum.CANCELADA;
    this.fechaActualizacion = new Date().toISOString();
  }

  devolver(): void {
    if (!this.puedeDevolver()) {
      throw new Error("No se puede devolver esta orden en su estado actual");
    }
    this.estado = EstadoOrdenEnum.DEVUELTA;
    this.fechaActualizacion = new Date().toISOString();
  }
}
