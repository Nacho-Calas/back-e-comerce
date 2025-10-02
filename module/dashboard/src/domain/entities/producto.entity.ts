import { UUID } from "@hex-lib/core";
import { EstadoProductoEnum } from "@/dashboard/domain/enums/estado_producto.enum";
import { CategoriaProductoEnum } from "@/dashboard/domain/enums/categoria_producto.enum";

type InformacionEnvio = {
  peso: number; // en kg
  dimensiones: {
    largo: number; // en cm
    ancho: number; // en cm
    alto: number; // en cm
  };
  fragil: boolean;
  requiereFirma: boolean;
  pesoMaximo?: number; // para equipos que soportan peso
  capacidad?: string; // para equipos con capacidad específica
};

type Especificaciones = {
  marca?: string;
  modelo?: string;
  voltaje?: string;
  potencia?: string;
  material?: string;
  color?: string;
  garantia?: string;
  certificaciones?: string[];
  [key: string]: string | number | boolean | string[] | undefined;
};

type ProductoConstructorParams = {
  id: UUID;
  nombre: string;
  descripcion: string;
  precio?: number | null; // precio en centavos para evitar problemas de decimales, puede ser nulo
  precioOriginal?: number | null; // para descuentos, puede ser nulo
  estado: EstadoProductoEnum;
  categoria: CategoriaProductoEnum;
  informacionEnvio?: InformacionEnvio | null; // información de envío, puede ser nula
  destacado: boolean;
  stock: number;
  stockMinimo: number; // stock mínimo para alertas de reposición
  especificaciones?: Especificaciones | null; // especificaciones técnicas, puede ser nula
  caracteristicas?: string[] | null; // características del producto, puede ser nula
  imagenes: string[]; // imágenes del producto, obligatorio al menos 1
  videos?: string[] | null; // videos del producto, puede ser nulo
  manuales?: string[] | null; // manuales del producto, puede ser nulo
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
};

export class Producto {
  private id: UUID;
  private nombre: string;
  private descripcion: string;
  private precio?: number | null;
  private precioOriginal?: number | null;
  private estado: EstadoProductoEnum;
  private categoria: CategoriaProductoEnum;
  private informacionEnvio?: InformacionEnvio | null;
  private destacado: boolean;
  private stock: number;
  private stockMinimo: number;
  private especificaciones?: Especificaciones | null;
  private caracteristicas?: string[] | null;
  private imagenes: string[];
  private videos?: string[] | null;
  private manuales?: string[] | null;
  private activo: boolean;
  private fechaCreacion: string;
  private fechaActualizacion: string;

  constructor(params: ProductoConstructorParams) {
    this.id = params.id;
    this.nombre = params.nombre;
    this.descripcion = params.descripcion;
    this.precio = params.precio ?? null;
    this.precioOriginal = params.precioOriginal ?? null;
    this.estado = params.estado;
    this.categoria = params.categoria;
    this.informacionEnvio = params.informacionEnvio ?? null;
    this.destacado = params.destacado;
    this.stock = params.stock;
    this.stockMinimo = params.stockMinimo;
    this.especificaciones = params.especificaciones ?? null;
    this.caracteristicas = params.caracteristicas ?? null;
    this.imagenes = params.imagenes;
    this.videos = params.videos ?? null;
    this.manuales = params.manuales ?? null;
    this.activo = params.activo;
    this.fechaCreacion = params.fechaCreacion;
    this.fechaActualizacion = params.fechaActualizacion;
  }

  // Getters
  getId(): UUID {
    return this.id;
  }

  getNombre(): string {
    return this.nombre;
  }

  getDescripcion(): string {
    return this.descripcion;
  }

  getPrecio(): number | null | undefined {
    return this.precio;
  }

  getPrecioOriginal(): number | null | undefined {
    return this.precioOriginal;
  }

  getPrecioFormateado(): string {
    if (this.precio === null || this.precio === undefined)
      return "Precio no disponible";
    return `$${(this.precio / 100).toFixed(2)}`;
  }

  getDescuento(): number {
    if (!this.precioOriginal || !this.precio) return 0;
    return Math.round(
      ((this.precioOriginal - this.precio) / this.precioOriginal) * 100
    );
  }

  getEstado(): EstadoProductoEnum {
    return this.estado;
  }

  getCategoria(): CategoriaProductoEnum {
    return this.categoria;
  }

  getInformacionEnvio(): InformacionEnvio | null | undefined {
    return this.informacionEnvio;
  }

  isDestacado(): boolean {
    return this.destacado;
  }

  getStock(): number {
    return this.stock;
  }

  getStockMinimo(): number {
    return this.stockMinimo;
  }

  isDisponible(): boolean {
    return (
      this.activo &&
      this.estado === EstadoProductoEnum.DISPONIBLE &&
      this.stock > 0
    );
  }

  isBajoStock(): boolean {
    return this.stock <= this.stockMinimo;
  }

  getEspecificaciones(): Especificaciones | null | undefined {
    return this.especificaciones;
  }

  getCaracteristicas(): string[] | null | undefined {
    return this.caracteristicas;
  }

  getImagenes(): string[] {
    return this.imagenes;
  }

  getVideos(): string[] | null | undefined {
    return this.videos;
  }

  getManuales(): string[] | null | undefined {
    return this.manuales;
  }

  isActivo(): boolean {
    return this.activo;
  }

  getFechaCreacion(): string {
    return this.fechaCreacion;
  }

  getFechaActualizacion(): string {
    return this.fechaActualizacion;
  }

  // Setters
  setId(id: UUID): void {
    this.id = id;
  }

  setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
  }

  setPrecio(precio: number): void {
    this.precio = precio;
  }

  setPrecioOriginal(precioOriginal: number): void {
    this.precioOriginal = precioOriginal;
  }

  setEstado(estado: EstadoProductoEnum): void {
    this.estado = estado;
  }

  setCategoria(categoria: CategoriaProductoEnum): void {
    this.categoria = categoria;
  }

  setInformacionEnvio(informacionEnvio: InformacionEnvio): void {
    this.informacionEnvio = informacionEnvio;
  }

  setDestacado(destacado: boolean): void {
    this.destacado = destacado;
  }

  setStock(stock: number): void {
    this.stock = stock;
  }

  setStockMinimo(stockMinimo: number): void {
    this.stockMinimo = stockMinimo;
  }

  reducirStock(cantidad: number): void {
    if (cantidad > this.stock) {
      throw new Error("No hay suficiente stock disponible");
    }
    this.stock -= cantidad;

    if (this.stock === 0) {
      this.estado = EstadoProductoEnum.AGOTADO;
    }
  }

  aumentarStock(cantidad: number): void {
    this.stock += cantidad;
    if (this.stock > 0 && this.estado === EstadoProductoEnum.AGOTADO) {
      this.estado = EstadoProductoEnum.DISPONIBLE;
    }
  }

  setEspecificaciones(especificaciones: Especificaciones): void {
    this.especificaciones = especificaciones;
  }

  setCaracteristicas(caracteristicas: string[]): void {
    this.caracteristicas = caracteristicas;
  }

  setImagenes(imagenes: string[]): void {
    this.imagenes = imagenes;
  }

  setVideos(videos: string[]): void {
    this.videos = videos;
  }

  setManuales(manuales: string[]): void {
    this.manuales = manuales;
  }

  setActivo(activo: boolean): void {
    this.activo = activo;
  }

  setFechaActualizacion(fecha: string): void {
    this.fechaActualizacion = fecha;
  }
}
