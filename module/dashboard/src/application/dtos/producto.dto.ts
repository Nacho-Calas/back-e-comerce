import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsObject,
  Min,
} from "class-validator";
import { EstadoProductoEnum } from "@/dashboard/domain/enums/estado_producto.enum";
import { CategoriaProductoEnum } from "@/dashboard/domain/enums/categoria_producto.enum";

export class InformacionEnvioDTO {
  @IsNumber()
  @Min(0)
  peso!: number; // en gramos

  @ValidateNested()
  dimensiones!: {
    largo: number; // en cm
    ancho: number; // en cm
    alto: number; // en cm
  };

  @IsBoolean()
  fragil!: boolean;

  @IsBoolean()
  requiereFirma!: boolean;

  constructor(informacionEnvioDTO: InformacionEnvioDTO) {
    this.peso = informacionEnvioDTO.peso;
    this.dimensiones = informacionEnvioDTO.dimensiones;
    this.fragil = informacionEnvioDTO.fragil;
    this.requiereFirma = informacionEnvioDTO.requiereFirma;
  }
}

export class EspecificacionesDTO {
  [key: string]: string | number | boolean;

  constructor(especificacionesDTO: EspecificacionesDTO) {
    Object.assign(this, especificacionesDTO);
  }
}

export class CreateProductoDTO {
  @IsString()
  nombre!: string;

  @IsString()
  descripcion!: string;

  @IsNumber()
  @Min(0)
  precio!: number; // precio en centavos

  @IsOptional()
  @IsNumber()
  @Min(0)
  precioOriginal?: number;

  @IsEnum(EstadoProductoEnum)
  estado!: EstadoProductoEnum;

  @IsEnum(CategoriaProductoEnum)
  categoria!: CategoriaProductoEnum;

  @ValidateNested()
  informacionEnvio!: InformacionEnvioDTO;

  @IsBoolean()
  destacado!: boolean;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsNumber()
  @Min(0)
  stockMinimo!: number;

  @IsOptional()
  @IsObject()
  especificaciones?: EspecificacionesDTO;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  caracteristicas?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagenes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  manuales?: string[];

  @IsBoolean()
  activo!: boolean;

  constructor(createProductoDTO: CreateProductoDTO) {
    this.nombre = createProductoDTO.nombre;
    this.descripcion = createProductoDTO.descripcion;
    this.precio = createProductoDTO.precio;
    this.precioOriginal = createProductoDTO.precioOriginal;
    this.estado = createProductoDTO.estado;
    this.categoria = createProductoDTO.categoria;
    this.informacionEnvio = new InformacionEnvioDTO(createProductoDTO.informacionEnvio);
    this.destacado = createProductoDTO.destacado;
    this.stock = createProductoDTO.stock;
    this.stockMinimo = createProductoDTO.stockMinimo;
    this.especificaciones = createProductoDTO.especificaciones ? new EspecificacionesDTO(createProductoDTO.especificaciones) : undefined;
    this.caracteristicas = createProductoDTO.caracteristicas || [];
    this.imagenes = createProductoDTO.imagenes || [];
    this.videos = createProductoDTO.videos;
    this.manuales = createProductoDTO.manuales;
    this.activo = createProductoDTO.activo;
  }
}

export class UpdateProductoDTO {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precioOriginal?: number;

  @IsOptional()
  @IsEnum(EstadoProductoEnum)
  estado?: EstadoProductoEnum;

  @IsOptional()
  @IsEnum(CategoriaProductoEnum)
  categoria?: CategoriaProductoEnum;

  @IsOptional()
  @ValidateNested()
  informacionEnvio?: InformacionEnvioDTO;

  @IsOptional()
  @IsBoolean()
  destacado?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMinimo?: number;

  @IsOptional()
  @IsObject()
  especificaciones?: EspecificacionesDTO;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  caracteristicas?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagenes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  manuales?: string[];

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  constructor(updateProductoDTO: UpdateProductoDTO) {
    this.id = updateProductoDTO.id;
    this.nombre = updateProductoDTO.nombre;
    this.descripcion = updateProductoDTO.descripcion;
    this.precio = updateProductoDTO.precio;
    this.precioOriginal = updateProductoDTO.precioOriginal;
    this.estado = updateProductoDTO.estado;
    this.categoria = updateProductoDTO.categoria;
    this.informacionEnvio = updateProductoDTO.informacionEnvio ? new InformacionEnvioDTO(updateProductoDTO.informacionEnvio) : undefined;
    this.destacado = updateProductoDTO.destacado;
    this.stock = updateProductoDTO.stock;
    this.stockMinimo = updateProductoDTO.stockMinimo;
    this.especificaciones = updateProductoDTO.especificaciones ? new EspecificacionesDTO(updateProductoDTO.especificaciones) : undefined;
    this.caracteristicas = updateProductoDTO.caracteristicas;
    this.imagenes = updateProductoDTO.imagenes;
    this.videos = updateProductoDTO.videos;
    this.manuales = updateProductoDTO.manuales;
    this.activo = updateProductoDTO.activo;
  }
}

export class ProductoDTO {
  @IsString()
  id!: string;

  @IsString()
  nombre!: string;

  @IsString()
  descripcion!: string;

  @IsNumber()
  precio!: number;

  @IsOptional()
  @IsNumber()
  precioOriginal?: number;

  @IsString()
  estado!: string;

  @IsEnum(CategoriaProductoEnum)
  categoria!: CategoriaProductoEnum;

  @ValidateNested()
  informacionEnvio!: InformacionEnvioDTO;

  @IsBoolean()
  destacado!: boolean;

  @IsNumber()
  stock!: number;

  @IsNumber()
  stockMinimo!: number;

  @IsObject()
  especificaciones!: EspecificacionesDTO;

  @IsArray()
  @IsString({ each: true })
  caracteristicas!: string[];

  @IsArray()
  @IsString({ each: true })
  imagenes!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  manuales?: string[];

  @IsBoolean()
  activo!: boolean;

  @IsString()
  fechaCreacion!: string;

  @IsString()
  fechaActualizacion!: string;

  constructor(productoResponseDTO: ProductoDTO) {
    this.id = productoResponseDTO.id;
    this.nombre = productoResponseDTO.nombre;
    this.descripcion = productoResponseDTO.descripcion;
    this.precio = productoResponseDTO.precio;
    this.precioOriginal = productoResponseDTO.precioOriginal;
    this.estado = productoResponseDTO.estado;
    this.categoria = productoResponseDTO.categoria;
    this.informacionEnvio = new InformacionEnvioDTO(productoResponseDTO.informacionEnvio);
    this.destacado = productoResponseDTO.destacado;
    this.stock = productoResponseDTO.stock;
    this.stockMinimo = productoResponseDTO.stockMinimo;
    this.especificaciones = new EspecificacionesDTO(productoResponseDTO.especificaciones);
    this.caracteristicas = productoResponseDTO.caracteristicas;
    this.imagenes = productoResponseDTO.imagenes;
    this.videos = productoResponseDTO.videos;
    this.manuales = productoResponseDTO.manuales;
    this.activo = productoResponseDTO.activo;
    this.fechaCreacion = productoResponseDTO.fechaCreacion;
    this.fechaActualizacion = productoResponseDTO.fechaActualizacion;
  }
}
