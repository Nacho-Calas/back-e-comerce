import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEmail,
  IsUrl,
  Min,
} from "class-validator";

export class CreateConfiguracionDTO {
  @IsString()
  nombreEmpresa!: string;

  @IsString()
  descripcion!: string;

  @IsOptional()
  @IsUrl()
  logo!: string | null;

  @IsOptional()
  @IsUrl()
  favicon!: string | null;

  @IsString()
  whatsappNumber!: string;

  @IsOptional()
  @IsString()
  telefono!: string | null;

  @IsOptional()
  @IsEmail()
  email!: string | null;

  @IsOptional()
  @IsString()
  direccion!: string | null;

  @IsOptional()
  @IsString()
  instagram!: string | null;

  @IsOptional()
  @IsUrl()
  facebook!: string | null;

  @IsOptional()
  @IsUrl()
  linkedin!: string | null;

  @IsOptional()
  @IsUrl()
  youtube!: string | null;

  @IsString()
  moneda!: string;

  @IsString()
  pais!: string;

  @IsString()
  zonaHoraria!: string;

  @IsString()
  idioma!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoEnvioGratis!: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoEnvioEstandar!: number | null;

  @IsOptional()
  @IsString()
  tiempoEntrega!: string | null;

  @IsOptional()
  @IsString()
  mensajeBienvenida!: string | null;

  @IsOptional()
  @IsString()
  mensajeDespedida!: string | null;

  constructor(createConfiguracionDTO: CreateConfiguracionDTO) {
    this.nombreEmpresa = createConfiguracionDTO.nombreEmpresa;
    this.descripcion = createConfiguracionDTO.descripcion;
    this.logo = createConfiguracionDTO.logo || null;
    this.favicon = createConfiguracionDTO.favicon || null;
    this.whatsappNumber = createConfiguracionDTO.whatsappNumber;
    this.telefono = createConfiguracionDTO.telefono || null;
    this.email = createConfiguracionDTO.email || null;
    this.direccion = createConfiguracionDTO.direccion || null;
    this.instagram = createConfiguracionDTO.instagram || null;
    this.facebook = createConfiguracionDTO.facebook || null;
    this.linkedin = createConfiguracionDTO.linkedin || null;
    this.youtube = createConfiguracionDTO.youtube || null;
    this.moneda = createConfiguracionDTO.moneda;
    this.pais = createConfiguracionDTO.pais;
    this.zonaHoraria = createConfiguracionDTO.zonaHoraria;
    this.idioma = createConfiguracionDTO.idioma;
    this.costoEnvioGratis = createConfiguracionDTO.costoEnvioGratis || null;
    this.costoEnvioEstandar = createConfiguracionDTO.costoEnvioEstandar || null;
    this.tiempoEntrega = createConfiguracionDTO.tiempoEntrega || null;
    this.mensajeBienvenida = createConfiguracionDTO.mensajeBienvenida || null;
    this.mensajeDespedida = createConfiguracionDTO.mensajeDespedida || null;
  }
}

export class UpdateConfiguracionDTO {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  nombreEmpresa!: string | null;

  @IsOptional()
  @IsString()
  descripcion!: string | null;

  @IsOptional()
  @IsUrl()
  logo!: string | null;

  @IsOptional()
  @IsUrl()
  favicon!: string | null;

  @IsOptional()
  @IsString()
  whatsappNumber!: string | null;

  @IsOptional()
  @IsString()
  telefono!: string | null;

  @IsOptional()
  @IsEmail()
  email!: string | null;

  @IsOptional()
  @IsString()
  direccion!: string | null;

  @IsOptional()
  @IsString()
  instagram!: string | null;

  @IsOptional()
  @IsUrl()
  facebook!: string | null;

  @IsOptional()
  @IsUrl()
  linkedin!: string | null;

  @IsOptional()
  @IsUrl()
  youtube!: string | null;

  @IsOptional()
  @IsString()
  moneda!: string | null;

  @IsOptional()
  @IsString()
  pais!: string | null;

  @IsOptional()
  @IsString()
  zonaHoraria!: string | null;

  @IsOptional()
  @IsString()
  idioma!: string | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoEnvioGratis!: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoEnvioEstandar!: number | null;

  @IsOptional()
  @IsString()
  tiempoEntrega!: string | null;

  @IsOptional()
  @IsString()
  mensajeBienvenida!: string | null;

  @IsOptional()
  @IsString()
  mensajeDespedida!: string | null;

  @IsOptional()
  @IsBoolean()
  activo!: boolean | null;

  constructor(updateConfiguracionDTO: UpdateConfiguracionDTO) {
    this.id = updateConfiguracionDTO.id;
    this.nombreEmpresa = updateConfiguracionDTO.nombreEmpresa || null;
    this.descripcion = updateConfiguracionDTO.descripcion || null;
    this.logo = updateConfiguracionDTO.logo || null;
    this.favicon = updateConfiguracionDTO.favicon || null;
    this.whatsappNumber = updateConfiguracionDTO.whatsappNumber || null;
    this.telefono = updateConfiguracionDTO.telefono || null;
    this.email = updateConfiguracionDTO.email || null;
    this.direccion = updateConfiguracionDTO.direccion || null;
    this.instagram = updateConfiguracionDTO.instagram || null;
    this.facebook = updateConfiguracionDTO.facebook || null;
    this.linkedin = updateConfiguracionDTO.linkedin || null;
    this.youtube = updateConfiguracionDTO.youtube || null;
    this.moneda = updateConfiguracionDTO.moneda || null;
    this.pais = updateConfiguracionDTO.pais || null;
    this.zonaHoraria = updateConfiguracionDTO.zonaHoraria || null;
    this.idioma = updateConfiguracionDTO.idioma || null;
    this.costoEnvioGratis = updateConfiguracionDTO.costoEnvioGratis || null;
    this.costoEnvioEstandar = updateConfiguracionDTO.costoEnvioEstandar || null;
    this.tiempoEntrega = updateConfiguracionDTO.tiempoEntrega || null;
    this.mensajeBienvenida = updateConfiguracionDTO.mensajeBienvenida || null;
    this.mensajeDespedida = updateConfiguracionDTO.mensajeDespedida || null;
    this.activo = updateConfiguracionDTO.activo || null;
  }
}

export class ConfiguracionDTO {
  @IsString()
  id!: string;

  @IsString()
  nombreEmpresa!: string;

  @IsString()
  descripcion!: string;

  @IsOptional()
  @IsUrl()
  logo!: string | null;

  @IsOptional()
  @IsUrl()
  favicon!: string | null;

  @IsString()
  whatsappNumber!: string;

  @IsOptional()
  @IsString()
  telefono!: string | null;

  @IsOptional()
  @IsEmail()
  email!: string | null;

  @IsOptional()
  @IsString()
  direccion!: string | null;

  @IsOptional()
  @IsString()
  instagram!: string | null;

  @IsOptional()
  @IsUrl()
  facebook!: string | null;

  @IsOptional()
  @IsUrl()
  linkedin!: string | null;

  @IsOptional()
  @IsUrl()
  youtube!: string | null;

  @IsString()
  moneda!: string;

  @IsString()
  pais!: string;

  @IsString()
  zonaHoraria!: string;

  @IsString()
  idioma!: string;

  @IsOptional()
  @IsNumber()
  costoEnvioGratis!: number | null;

  @IsOptional()
  @IsNumber()
  costoEnvioEstandar!: number | null;

  @IsOptional()
  @IsString()
  tiempoEntrega!: string | null;

  @IsOptional()
  @IsString()
  mensajeBienvenida!: string | null;

  @IsOptional()
  @IsString()
  mensajeDespedida!: string | null;

  @IsString()
  fechaCreacion!: string;

  @IsString()
  fechaActualizacion!: string;

  @IsBoolean()
  activo!: boolean;

  constructor(configuracionResponseDTO: ConfiguracionDTO) {
    this.id = configuracionResponseDTO.id;
    this.nombreEmpresa = configuracionResponseDTO.nombreEmpresa;
    this.descripcion = configuracionResponseDTO.descripcion;
    this.logo = configuracionResponseDTO.logo || null;
    this.favicon = configuracionResponseDTO.favicon || null;
    this.whatsappNumber = configuracionResponseDTO.whatsappNumber;
    this.telefono = configuracionResponseDTO.telefono || null;
    this.email = configuracionResponseDTO.email || null;
    this.direccion = configuracionResponseDTO.direccion || null;
    this.instagram = configuracionResponseDTO.instagram || null;
    this.facebook = configuracionResponseDTO.facebook || null;
    this.linkedin = configuracionResponseDTO.linkedin || null;
    this.youtube = configuracionResponseDTO.youtube || null;
    this.moneda = configuracionResponseDTO.moneda;
    this.pais = configuracionResponseDTO.pais;
    this.zonaHoraria = configuracionResponseDTO.zonaHoraria;
    this.idioma = configuracionResponseDTO.idioma;
    this.costoEnvioGratis = configuracionResponseDTO.costoEnvioGratis || null;
    this.costoEnvioEstandar = configuracionResponseDTO.costoEnvioEstandar || null;
    this.tiempoEntrega = configuracionResponseDTO.tiempoEntrega || null;
    this.mensajeBienvenida = configuracionResponseDTO.mensajeBienvenida || null;
    this.mensajeDespedida = configuracionResponseDTO.mensajeDespedida || null;
    this.fechaCreacion = configuracionResponseDTO.fechaCreacion;
    this.fechaActualizacion = configuracionResponseDTO.fechaActualizacion;
    this.activo = configuracionResponseDTO.activo;
  }
}
