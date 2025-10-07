import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  IsObject,
  Min,
} from "class-validator";

export class ItemCarritoDTO {
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
  imagen!: string | null;

  @IsOptional()
  @IsObject()
  especificaciones!: { [key: string]: string | number | boolean } | null;

  constructor(itemCarritoDTO: ItemCarritoDTO) {
    this.productoId = itemCarritoDTO.productoId;
    this.nombre = itemCarritoDTO.nombre;
    this.precio = itemCarritoDTO.precio;
    this.cantidad = itemCarritoDTO.cantidad;
    this.imagen = itemCarritoDTO.imagen || null;
    this.especificaciones = itemCarritoDTO.especificaciones || null;
  }
}

export class CreateCarritoDTO {
  @IsString()
  sessionId!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  items?: ItemCarritoDTO[];

  constructor(createCarritoDTO: CreateCarritoDTO) {
    this.sessionId = createCarritoDTO.sessionId;
    this.items = createCarritoDTO.items || [];
  }
}

export class UpdateCarritoDTO {
  @IsString()
  id!: string;

  @IsString()
  sessionId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  items!: ItemCarritoDTO[];

  constructor(updateCarritoDTO: UpdateCarritoDTO) {
    this.id = updateCarritoDTO.id;
    this.sessionId = updateCarritoDTO.sessionId;
    this.items = updateCarritoDTO.items.map((item) => new ItemCarritoDTO(item));
  }
}

export class AgregarItemCarritoDTO {
  @IsString()
  carritoId!: string;

  @ValidateNested()
  item!: ItemCarritoDTO;

  constructor(agregarItemCarritoDTO: AgregarItemCarritoDTO) {
    this.carritoId = agregarItemCarritoDTO.carritoId;
    this.item = new ItemCarritoDTO(agregarItemCarritoDTO.item);
  }
}

export class ActualizarCantidadItemDTO {
  @IsString()
  carritoId!: string;

  @IsString()
  productoId!: string;

  @IsNumber()
  @Min(0)
  cantidad!: number;

  constructor(actualizarCantidadItemDTO: ActualizarCantidadItemDTO) {
    this.carritoId = actualizarCantidadItemDTO.carritoId;
    this.productoId = actualizarCantidadItemDTO.productoId;
    this.cantidad = actualizarCantidadItemDTO.cantidad;
  }
}

export class EliminarItemCarritoDTO {
  @IsString()
  carritoId!: string;

  @IsString()
  productoId!: string;

  constructor(eliminarItemCarritoDTO: EliminarItemCarritoDTO) {
    this.carritoId = eliminarItemCarritoDTO.carritoId;
    this.productoId = eliminarItemCarritoDTO.productoId;
  }
}

export class CarritoDTO {
  @IsString()
  id!: string;

  @IsString()
  sessionId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  items!: ItemCarritoDTO[];

  @IsString()
  fechaCreacion!: string;

  @IsString()
  fechaActualizacion!: string;

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsNumber()
  totalItems?: number;

  constructor(carritoResponseDTO: CarritoDTO) {
    this.id = carritoResponseDTO.id;
    this.sessionId = carritoResponseDTO.sessionId;
    this.items = carritoResponseDTO.items.map(
      (item) => new ItemCarritoDTO(item)
    );
    this.fechaCreacion = carritoResponseDTO.fechaCreacion;
    this.fechaActualizacion = carritoResponseDTO.fechaActualizacion;
    this.total = carritoResponseDTO.total || 0;
    this.totalItems = carritoResponseDTO.totalItems || 0;
  }
}
