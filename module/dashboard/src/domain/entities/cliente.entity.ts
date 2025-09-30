import { UUID } from "@hex-lib/core";

type Direccion = {
  id: string;
  nombre: string;
  apellido: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  telefono: string;
  email: string;
  esPrincipal: boolean;
  instrucciones?: string;
};

type ClienteConstructorParams = {
  id: UUID;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fechaNacimiento?: string;
  genero?: string;
  direcciones: Direccion[];
  preferencias: {
    notificacionesEmail: boolean;
    notificacionesSMS: boolean;
    newsletter: boolean;
  };
  fechaCreacion: string;
  fechaActualizacion: string;
  ultimoAcceso?: string;
  activo: boolean;
};

export class Cliente {
  private id: UUID;
  private email: string;
  private nombre: string;
  private apellido: string;
  private telefono: string;
  private fechaNacimiento?: string;
  private genero?: string;
  private direcciones: Direccion[];
  private preferencias: {
    notificacionesEmail: boolean;
    notificacionesSMS: boolean;
    newsletter: boolean;
  };
  private fechaCreacion: string;
  private fechaActualizacion: string;
  private ultimoAcceso?: string;
  private activo: boolean;

  constructor(params: ClienteConstructorParams) {
    this.id = params.id;
    this.email = params.email;
    this.nombre = params.nombre;
    this.apellido = params.apellido;
    this.telefono = params.telefono;
    this.fechaNacimiento = params.fechaNacimiento;
    this.genero = params.genero;
    this.direcciones = params.direcciones;
    this.preferencias = params.preferencias;
    this.fechaCreacion = params.fechaCreacion;
    this.fechaActualizacion = params.fechaActualizacion;
    this.ultimoAcceso = params.ultimoAcceso;
    this.activo = params.activo;
  }

  // Getters
  getId(): UUID {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getNombre(): string {
    return this.nombre;
  }

  getApellido(): string {
    return this.apellido;
  }

  getNombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }

  getTelefono(): string {
    return this.telefono;
  }

  getFechaNacimiento(): string | undefined {
    return this.fechaNacimiento;
  }

  getGenero(): string | undefined {
    return this.genero;
  }

  getDirecciones(): Direccion[] {
    return this.direcciones;
  }

  getDireccionPrincipal(): Direccion | undefined {
    return this.direcciones.find(dir => dir.esPrincipal);
  }

  getPreferencias(): {
    notificacionesEmail: boolean;
    notificacionesSMS: boolean;
    newsletter: boolean;
  } {
    return this.preferencias;
  }

  getFechaCreacion(): string {
    return this.fechaCreacion;
  }

  getFechaActualizacion(): string {
    return this.fechaActualizacion;
  }

  getUltimoAcceso(): string | undefined {
    return this.ultimoAcceso;
  }

  isActivo(): boolean {
    return this.activo;
  }

  // Métodos de edad
  getEdad(): number | undefined {
    if (!this.fechaNacimiento) return undefined;
    
    const hoy = new Date();
    const nacimiento = new Date(this.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  // Métodos de direcciones
  agregarDireccion(direccion: Direccion): void {
    // Si es la primera dirección o se marca como principal, hacerla principal
    if (this.direcciones.length === 0 || direccion.esPrincipal) {
      this.direcciones.forEach(dir => dir.esPrincipal = false);
      direccion.esPrincipal = true;
    }
    
    this.direcciones.push(direccion);
    this.fechaActualizacion = new Date().toISOString();
  }

  actualizarDireccion(direccionId: string, direccionActualizada: Partial<Direccion>): void {
    const index = this.direcciones.findIndex(dir => dir.id === direccionId);
    
    if (index !== -1) {
      this.direcciones[index] = { ...this.direcciones[index], ...direccionActualizada };
      
      // Si se marca como principal, quitar principal de las demás
      if (direccionActualizada.esPrincipal) {
        this.direcciones.forEach((dir, i) => {
          if (i !== index) dir.esPrincipal = false;
        });
      }
      
      this.fechaActualizacion = new Date().toISOString();
    }
  }

  eliminarDireccion(direccionId: string): void {
    const direccion = this.direcciones.find(dir => dir.id === direccionId);
    
    if (direccion && direccion.esPrincipal && this.direcciones.length > 1) {
      // Si se elimina la dirección principal, hacer principal la primera restante
      this.direcciones = this.direcciones.filter(dir => dir.id !== direccionId);
      if (this.direcciones.length > 0) {
        this.direcciones[0].esPrincipal = true;
      }
    } else {
      this.direcciones = this.direcciones.filter(dir => dir.id !== direccionId);
    }
    
    this.fechaActualizacion = new Date().toISOString();
  }

  setDireccionPrincipal(direccionId: string): void {
    this.direcciones.forEach(dir => {
      dir.esPrincipal = dir.id === direccionId;
    });
    this.fechaActualizacion = new Date().toISOString();
  }

  // Setters
  setId(id: UUID): void {
    this.id = id;
  }

  setEmail(email: string): void {
    this.email = email;
    this.fechaActualizacion = new Date().toISOString();
  }

  setNombre(nombre: string): void {
    this.nombre = nombre;
    this.fechaActualizacion = new Date().toISOString();
  }

  setApellido(apellido: string): void {
    this.apellido = apellido;
    this.fechaActualizacion = new Date().toISOString();
  }

  setTelefono(telefono: string): void {
    this.telefono = telefono;
    this.fechaActualizacion = new Date().toISOString();
  }

  setFechaNacimiento(fechaNacimiento: string): void {
    this.fechaNacimiento = fechaNacimiento;
    this.fechaActualizacion = new Date().toISOString();
  }

  setGenero(genero: string): void {
    this.genero = genero;
    this.fechaActualizacion = new Date().toISOString();
  }

  setPreferencias(preferencias: {
    notificacionesEmail: boolean;
    notificacionesSMS: boolean;
    newsletter: boolean;
  }): void {
    this.preferencias = preferencias;
    this.fechaActualizacion = new Date().toISOString();
  }

  setUltimoAcceso(ultimoAcceso: string): void {
    this.ultimoAcceso = ultimoAcceso;
    this.fechaActualizacion = new Date().toISOString();
  }

  setActivo(activo: boolean): void {
    this.activo = activo;
    this.fechaActualizacion = new Date().toISOString();
  }

  setFechaActualizacion(fecha: string): void {
    this.fechaActualizacion = fecha;
  }

  // Método para actualizar último acceso
  actualizarUltimoAcceso(): void {
    this.ultimoAcceso = new Date().toISOString();
    this.fechaActualizacion = new Date().toISOString();
  }
}
