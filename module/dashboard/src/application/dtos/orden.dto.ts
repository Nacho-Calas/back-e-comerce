import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  IsObject,
  IsEnum,
  Min,
  IsEmail,
} from "class-validator";
import { EstadoOrdenEnum } from "@/dashboard/domain/enums/estado_orden.enum";
import { MetodoPagoEnum } from "@/dashboard/domain/enums/metodo_pago.enum";

export class ItemOrdenDTO {
  @IsString()
  productoId!: string;

  @IsString()
  nombre!: string;

  @IsNumber()
  @Min(0)
  precio!: number;

  @IsNumber()
  @Min(1)
  cantidad!: number;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsObject()
  especificaciones?: { [key: string]: string | number | boolean };

  constructor(itemOrdenDTO: ItemOrdenDTO) {
    this.productoId = itemOrdenDTO.productoId;
    this.nombre = itemOrdenDTO.nombre;
    this.precio = itemOrdenDTO.precio;
    this.cantidad = itemOrdenDTO.cantidad;
    this.imagen = itemOrdenDTO.imagen;
    this.especificaciones = itemOrdenDTO.especificaciones;
  }
}

export class DireccionEnvioDTO {
  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsString()
  direccion!: string;

  @IsString()
  ciudad!: string;

  @IsString()
  provincia!: string;

  @IsString()
  codigoPostal!: string;

  @IsString()
  telefono!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  instrucciones?: string;

  constructor(direccionEnvioDTO: DireccionEnvioDTO) {
    this.nombre = direccionEnvioDTO.nombre;
    this.apellido = direccionEnvioDTO.apellido;
    this.direccion = direccionEnvioDTO.direccion;
    this.ciudad = direccionEnvioDTO.ciudad;
    this.provincia = direccionEnvioDTO.provincia;
    this.codigoPostal = direccionEnvioDTO.codigoPostal;
    this.telefono = direccionEnvioDTO.telefono;
    this.email = direccionEnvioDTO.email;
    this.instrucciones = direccionEnvioDTO.instrucciones;
  }
}

export class InformacionPagoDTO {
  @IsEnum(MetodoPagoEnum)
  metodo!: MetodoPagoEnum;

  @IsOptional()
  @IsString()
  numeroTarjeta?: string;

  @IsOptional()
  @IsString()
  fechaVencimiento?: string;

  @IsOptional()
  @IsString()
  nombreTitular?: string;

  @IsOptional()
  @IsString()
  transaccionId?: string;

  constructor(informacionPagoDTO: InformacionPagoDTO) {
    this.metodo = informacionPagoDTO.metodo;
    this.numeroTarjeta = informacionPagoDTO.numeroTarjeta;
    this.fechaVencimiento = informacionPagoDTO.fechaVencimiento;
    this.nombreTitular = informacionPagoDTO.nombreTitular;
    this.transaccionId = informacionPagoDTO.transaccionId;
  }
}

export class CreateOrdenDTO {
  @IsString()
  usuarioId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  items!: ItemOrdenDTO[];

  @ValidateNested()
  direccionEnvio!: DireccionEnvioDTO;

  @ValidateNested()
  informacionPago!: InformacionPagoDTO;

  @IsNumber()
  @Min(0)
  subtotal!: number;

  @IsNumber()
  @Min(0)
  costoEnvio!: number;

  @IsNumber()
  @Min(0)
  descuento!: number;

  @IsNumber()
  @Min(0)
  total!: number;

  @IsOptional()
  @IsString()
  notas?: string;

  constructor(createOrdenDTO: CreateOrdenDTO) {
    this.usuarioId = createOrdenDTO.usuarioId;
    this.items = createOrdenDTO.items.map(item => new ItemOrdenDTO(item));
    this.direccionEnvio = new DireccionEnvioDTO(createOrdenDTO.direccionEnvio);
    this.informacionPago = new InformacionPagoDTO(createOrdenDTO.informacionPago);
    this.subtotal = createOrdenDTO.subtotal;
    this.costoEnvio = createOrdenDTO.costoEnvio;
    this.descuento = createOrdenDTO.descuento;
    this.total = createOrdenDTO.total;
    this.notas = createOrdenDTO.notas;
  }
}

export class UpdateOrdenDTO {
  @IsString()
  id!: string;

  @IsOptional()
  @IsEnum(EstadoOrdenEnum)
  estado?: EstadoOrdenEnum;

  @IsOptional()
  @IsString()
  numeroSeguimiento?: string;

  @IsOptional()
  @IsString()
  notas?: string;

  constructor(updateOrdenDTO: UpdateOrdenDTO) {
    this.id = updateOrdenDTO.id;
    this.estado = updateOrdenDTO.estado;
    this.numeroSeguimiento = updateOrdenDTO.numeroSeguimiento;
    this.notas = updateOrdenDTO.notas;
  }
}

export class OrdenDTO {
  @IsString()
  id!: string;

  @IsString()
  numeroOrden!: string;

  @IsString()
  usuarioId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  items!: ItemOrdenDTO[];

  @ValidateNested()
  direccionEnvio!: DireccionEnvioDTO;

  @ValidateNested()
  informacionPago!: InformacionPagoDTO;

  @IsNumber()
  subtotal!: number;

  @IsNumber()
  costoEnvio!: number;

  @IsNumber()
  descuento!: number;

  @IsNumber()
  total!: number;

  @IsString()
  estado!: string;

  @IsString()
  fechaCreacion!: string;

  @IsString()
  fechaActualizacion!: string;

  @IsOptional()
  @IsString()
  fechaEnvio?: string;

  @IsOptional()
  @IsString()
  fechaEntrega?: string;

  @IsOptional()
  @IsString()
  numeroSeguimiento?: string;

  @IsOptional()
  @IsString()
  notas?: string;

  constructor(ordenResponseDTO: OrdenDTO) {
    this.id = ordenResponseDTO.id;
    this.numeroOrden = ordenResponseDTO.numeroOrden;
    this.usuarioId = ordenResponseDTO.usuarioId;
    this.items = ordenResponseDTO.items.map(item => new ItemOrdenDTO(item));
    this.direccionEnvio = new DireccionEnvioDTO(ordenResponseDTO.direccionEnvio);
    this.informacionPago = new InformacionPagoDTO(ordenResponseDTO.informacionPago);
    this.subtotal = ordenResponseDTO.subtotal;
    this.costoEnvio = ordenResponseDTO.costoEnvio;
    this.descuento = ordenResponseDTO.descuento;
    this.total = ordenResponseDTO.total;
    this.estado = ordenResponseDTO.estado;
    this.fechaCreacion = ordenResponseDTO.fechaCreacion;
    this.fechaActualizacion = ordenResponseDTO.fechaActualizacion;
    this.fechaEnvio = ordenResponseDTO.fechaEnvio;
    this.fechaEntrega = ordenResponseDTO.fechaEntrega;
    this.numeroSeguimiento = ordenResponseDTO.numeroSeguimiento;
    this.notas = ordenResponseDTO.notas;
  }
}
