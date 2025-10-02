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
  ArrayMinSize,
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

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number | null; // precio en centavos, puede ser nulo

  @IsOptional()
  @IsNumber()
  @Min(0)
  precioOriginal?: number | null; // precio original, puede ser nulo

  @IsEnum(EstadoProductoEnum)
  estado!: EstadoProductoEnum;

  @IsEnum(CategoriaProductoEnum)
  categoria!: CategoriaProductoEnum;

  @IsOptional()
  @ValidateNested()
  informacionEnvio?: InformacionEnvioDTO | null; // información de envío, puede ser nula

  @IsBoolean()
  destacado!: boolean;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsNumber()
  @Min(0)
  stockMinimo!: number; // stock mínimo para alertas de reposición

  @IsOptional()
  @IsObject()
  especificaciones?: EspecificacionesDTO | null; // especificaciones técnicas, puede ser nula

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  caracteristicas?: string[] | null; // características del producto, puede ser nula

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: "Debe incluir al menos una imagen" })
  imagenes!: string[]; // imágenes del producto, obligatorio al menos 1

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[] | null; // videos del producto, puede ser nulo

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  manuales?: string[] | null; // manuales del producto, puede ser nulo

  @IsBoolean()
  activo!: boolean;

  constructor(createProductoDTO: CreateProductoDTO) {
    this.nombre = createProductoDTO.nombre;
    this.descripcion = createProductoDTO.descripcion;
    this.precio = createProductoDTO.precio ?? null;
    this.precioOriginal = createProductoDTO.precioOriginal ?? null;
    this.estado = createProductoDTO.estado;
    this.categoria = createProductoDTO.categoria;
    this.informacionEnvio = createProductoDTO.informacionEnvio
      ? new InformacionEnvioDTO(createProductoDTO.informacionEnvio)
      : null;
    this.destacado = createProductoDTO.destacado;
    this.stock = createProductoDTO.stock;
    this.stockMinimo = createProductoDTO.stockMinimo;
    this.especificaciones = createProductoDTO.especificaciones
      ? new EspecificacionesDTO(createProductoDTO.especificaciones)
      : null;
    this.caracteristicas = createProductoDTO.caracteristicas ?? null;
    this.imagenes = createProductoDTO.imagenes;
    this.videos = createProductoDTO.videos ?? null;
    this.manuales = createProductoDTO.manuales ?? null;
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
  informacionEnvio?: InformacionEnvioDTO | undefined;

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
  especificaciones?: EspecificacionesDTO | undefined;

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
    this.nombre = updateProductoDTO.nombre ?? "";
    this.descripcion = updateProductoDTO.descripcion ?? "";
    this.precio = updateProductoDTO.precio ?? 0;
    this.precioOriginal = updateProductoDTO.precioOriginal ?? 0;
    this.estado = updateProductoDTO.estado ?? EstadoProductoEnum.DISPONIBLE;
    this.categoria =
      updateProductoDTO.categoria ?? CategoriaProductoEnum.LECTORES_RFID;
    this.informacionEnvio = updateProductoDTO.informacionEnvio
      ? new InformacionEnvioDTO(updateProductoDTO.informacionEnvio)
      : undefined;
    this.destacado = updateProductoDTO.destacado ?? false;
    this.stock = updateProductoDTO.stock ?? 0;
    this.stockMinimo = updateProductoDTO.stockMinimo ?? 0;
    this.especificaciones = updateProductoDTO.especificaciones
      ? new EspecificacionesDTO(updateProductoDTO.especificaciones)
      : undefined;
    this.caracteristicas = updateProductoDTO.caracteristicas ?? [];
    this.imagenes = updateProductoDTO.imagenes ?? [];
    this.videos = updateProductoDTO.videos ?? [];
    this.manuales = updateProductoDTO.manuales ?? [];
    this.activo = updateProductoDTO.activo ?? true;
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
  precioOriginal?: number | undefined;

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
  videos?: string[] | undefined;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  manuales?: string[] | undefined;

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
    this.informacionEnvio = new InformacionEnvioDTO(
      productoResponseDTO.informacionEnvio
    );
    this.destacado = productoResponseDTO.destacado;
    this.stock = productoResponseDTO.stock;
    this.stockMinimo = productoResponseDTO.stockMinimo;
    this.especificaciones = new EspecificacionesDTO(
      productoResponseDTO.especificaciones
    );
    this.caracteristicas = productoResponseDTO.caracteristicas;
    this.imagenes = productoResponseDTO.imagenes;
    this.videos = productoResponseDTO.videos;
    this.manuales = productoResponseDTO.manuales;
    this.activo = productoResponseDTO.activo;
    this.fechaCreacion = productoResponseDTO.fechaCreacion;
    this.fechaActualizacion = productoResponseDTO.fechaActualizacion;
  }
}
