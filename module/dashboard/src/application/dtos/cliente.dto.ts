import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEmail,
  IsObject,
} from "class-validator";

export class DireccionDTO {
  @IsString()
  id!: string;

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

  @IsBoolean()
  esPrincipal!: boolean;

  @IsOptional()
  @IsString()
  instrucciones?: string;

  constructor(direccionDTO: DireccionDTO) {
    this.id = direccionDTO.id;
    this.nombre = direccionDTO.nombre;
    this.apellido = direccionDTO.apellido;
    this.direccion = direccionDTO.direccion;
    this.ciudad = direccionDTO.ciudad;
    this.provincia = direccionDTO.provincia;
    this.codigoPostal = direccionDTO.codigoPostal;
    this.telefono = direccionDTO.telefono;
    this.email = direccionDTO.email;
    this.esPrincipal = direccionDTO.esPrincipal;
    this.instrucciones = direccionDTO.instrucciones;
  }
}

export class PreferenciasDTO {
  @IsBoolean()
  notificacionesEmail!: boolean;

  @IsBoolean()
  notificacionesSMS!: boolean;

  @IsBoolean()
  newsletter!: boolean;

  constructor(preferenciasDTO: PreferenciasDTO) {
    this.notificacionesEmail = preferenciasDTO.notificacionesEmail;
    this.notificacionesSMS = preferenciasDTO.notificacionesSMS;
    this.newsletter = preferenciasDTO.newsletter;
  }
}

export class CreateClienteDTO {
  @IsEmail()
  email!: string;

  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsString()
  telefono!: string;

  @IsOptional()
  @IsString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  genero?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  direcciones?: DireccionDTO[];

  @IsOptional()
  @ValidateNested()
  preferencias?: PreferenciasDTO;

  constructor(createClienteDTO: CreateClienteDTO) {
    this.email = createClienteDTO.email;
    this.nombre = createClienteDTO.nombre;
    this.apellido = createClienteDTO.apellido;
    this.telefono = createClienteDTO.telefono;
    this.fechaNacimiento = createClienteDTO.fechaNacimiento;
    this.genero = createClienteDTO.genero;
    this.direcciones = createClienteDTO.direcciones?.map(dir => new DireccionDTO(dir)) || [];
    this.preferencias = createClienteDTO.preferencias ? new PreferenciasDTO(createClienteDTO.preferencias) : {
      notificacionesEmail: true,
      notificacionesSMS: false,
      newsletter: true,
    };
  }
}

export class UpdateClienteDTO {
  @IsString()
  id!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  genero?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  direcciones?: DireccionDTO[];

  @IsOptional()
  @ValidateNested()
  preferencias?: PreferenciasDTO;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  constructor(updateClienteDTO: UpdateClienteDTO) {
    this.id = updateClienteDTO.id;
    this.email = updateClienteDTO.email;
    this.nombre = updateClienteDTO.nombre;
    this.apellido = updateClienteDTO.apellido;
    this.telefono = updateClienteDTO.telefono;
    this.fechaNacimiento = updateClienteDTO.fechaNacimiento;
    this.genero = updateClienteDTO.genero;
    this.direcciones = updateClienteDTO.direcciones?.map(dir => new DireccionDTO(dir));
    this.preferencias = updateClienteDTO.preferencias ? new PreferenciasDTO(updateClienteDTO.preferencias) : undefined;
    this.activo = updateClienteDTO.activo;
  }
}

export class ClienteDTO {
  @IsString()
  id!: string;

  @IsEmail()
  email!: string;

  @IsString()
  nombre!: string;

  @IsString()
  apellido!: string;

  @IsString()
  telefono!: string;

  @IsOptional()
  @IsString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  genero?: string;

  @IsArray()
  @ValidateNested({ each: true })
  direcciones!: DireccionDTO[];

  @ValidateNested()
  preferencias!: PreferenciasDTO;

  @IsString()
  fechaCreacion!: string;

  @IsString()
  fechaActualizacion!: string;

  @IsOptional()
  @IsString()
  ultimoAcceso?: string;

  @IsBoolean()
  activo!: boolean;

  constructor(clienteResponseDTO: ClienteDTO) {
    this.id = clienteResponseDTO.id;
    this.email = clienteResponseDTO.email;
    this.nombre = clienteResponseDTO.nombre;
    this.apellido = clienteResponseDTO.apellido;
    this.telefono = clienteResponseDTO.telefono;
    this.fechaNacimiento = clienteResponseDTO.fechaNacimiento;
    this.genero = clienteResponseDTO.genero;
    this.direcciones = clienteResponseDTO.direcciones.map(dir => new DireccionDTO(dir));
    this.preferencias = new PreferenciasDTO(clienteResponseDTO.preferencias);
    this.fechaCreacion = clienteResponseDTO.fechaCreacion;
    this.fechaActualizacion = clienteResponseDTO.fechaActualizacion;
    this.ultimoAcceso = clienteResponseDTO.ultimoAcceso;
    this.activo = clienteResponseDTO.activo;
  }
}
