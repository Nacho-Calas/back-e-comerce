import { UUID } from "@hex-lib/core";

type ConfiguracionConstructorParams = {
  id: UUID;
  // Información básica
  nombreEmpresa: string;
  descripcion: string;
  logo: string | null;
  favicon: string | null;

  // Contacto
  whatsappNumber: string;
  telefono: string | null;
  email: string | null;
  direccion: string | null;

  // Redes sociales
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  youtube: string | null;

  // Configuración del e-commerce
  moneda: string;
  pais: string;
  zonaHoraria: string;
  idioma: string;

  // Configuración de envío
  costoEnvioGratis: number | null;
  costoEnvioEstandar: number | null;
  tiempoEntrega: string | null;

  // Configuración de WhatsApp
  mensajeBienvenida: string | null;
  mensajeDespedida: string | null;

  // Metadatos
  fechaCreacion: string;
  fechaActualizacion: string;
  activo: boolean;
};

export class Configuracion {
  private id: UUID;
  private nombreEmpresa: string;
  private descripcion: string;
  private logo: string | null;
  private favicon: string | null;
  private whatsappNumber: string;
  private telefono: string | null;
  private email: string | null;
  private direccion: string | null;
  private instagram: string | null;
  private facebook: string | null;
  private linkedin: string | null;
  private youtube: string | null;
  private moneda: string;
  private pais: string;
  private zonaHoraria: string;
  private idioma: string;
  private costoEnvioGratis: number | null;
  private costoEnvioEstandar: number | null;
  private tiempoEntrega: string | null;
  private mensajeBienvenida: string | null;
  private mensajeDespedida: string | null;
  private fechaCreacion: string;
  private fechaActualizacion: string;
  private activo: boolean;

  constructor(params: ConfiguracionConstructorParams) {
    this.id = params.id;
    this.nombreEmpresa = params.nombreEmpresa;
    this.descripcion = params.descripcion;
    this.logo = params.logo;
    this.favicon = params.favicon;
    this.whatsappNumber = params.whatsappNumber;
    this.telefono = params.telefono;
    this.email = params.email;
    this.direccion = params.direccion;
    this.instagram = params.instagram;
    this.facebook = params.facebook;
    this.linkedin = params.linkedin;
    this.youtube = params.youtube;
    this.moneda = params.moneda;
    this.pais = params.pais;
    this.zonaHoraria = params.zonaHoraria;
    this.idioma = params.idioma;
    this.costoEnvioGratis = params.costoEnvioGratis;
    this.costoEnvioEstandar = params.costoEnvioEstandar;
    this.tiempoEntrega = params.tiempoEntrega;
    this.mensajeBienvenida = params.mensajeBienvenida;
    this.mensajeDespedida = params.mensajeDespedida;
    this.fechaCreacion = params.fechaCreacion;
    this.fechaActualizacion = params.fechaActualizacion;
    this.activo = params.activo;
  }

  // Getters
  getId(): UUID {
    return this.id;
  }

  getNombreEmpresa(): string {
    return this.nombreEmpresa;
  }

  getDescripcion(): string {
    return this.descripcion;
  }

  getLogo(): string | null {
    return this.logo;
  }

  getFavicon(): string | null {
    return this.favicon;
  }

  getWhatsappNumber(): string {
    return this.whatsappNumber;
  }

  getTelefono(): string | null {
    return this.telefono;
  }

  getEmail(): string | null {
    return this.email;
  }

  getDireccion(): string | null {
    return this.direccion;
  }

  getInstagram(): string | null {
    return this.instagram;
  }

  getFacebook(): string | null {
    return this.facebook;
  }

  getLinkedin(): string | null {
    return this.linkedin;
  }

  getYoutube(): string | null {
    return this.youtube;
  }

  getMoneda(): string {
    return this.moneda;
  }

  getPais(): string {
    return this.pais;
  }

  getZonaHoraria(): string {
    return this.zonaHoraria;
  }

  getIdioma(): string {
    return this.idioma;
  }

  getCostoEnvioGratis(): number | null {
    return this.costoEnvioGratis;
  }

  getCostoEnvioEstandar(): number | null {
    return this.costoEnvioEstandar;
  }

  getTiempoEntrega(): string | null {
    return this.tiempoEntrega;
  }

  getMensajeBienvenida(): string | null {
    return this.mensajeBienvenida;
  }

  getMensajeDespedida(): string | null {
    return this.mensajeDespedida;
  }

  getFechaCreacion(): string {
    return this.fechaCreacion;
  }

  getFechaActualizacion(): string {
    return this.fechaActualizacion;
  }

  isActivo(): boolean {
    return this.activo;
  }

  // Setters
  setNombreEmpresa(nombreEmpresa: string): void {
    this.nombreEmpresa = nombreEmpresa;
    this.fechaActualizacion = new Date().toISOString();
  }

  setDescripcion(descripcion: string): void {
    this.descripcion = descripcion;
    this.fechaActualizacion = new Date().toISOString();
  }

  setLogo(logo: string | null): void {
    this.logo = logo;
    this.fechaActualizacion = new Date().toISOString();
  }

  setFavicon(favicon: string | null): void {
    this.favicon = favicon;
    this.fechaActualizacion = new Date().toISOString();
  }

  setWhatsappNumber(whatsappNumber: string): void {
    this.whatsappNumber = whatsappNumber;
    this.fechaActualizacion = new Date().toISOString();
  }

  setTelefono(telefono: string | null): void {
    this.telefono = telefono;
    this.fechaActualizacion = new Date().toISOString();
  }

  setEmail(email: string | null): void {
    this.email = email;
    this.fechaActualizacion = new Date().toISOString();
  }

  setDireccion(direccion: string | null): void {
    this.direccion = direccion;
    this.fechaActualizacion = new Date().toISOString();
  }

  setInstagram(instagram: string | null): void {
    this.instagram = instagram;
    this.fechaActualizacion = new Date().toISOString();
  }

  setFacebook(facebook: string | null): void {
    this.facebook = facebook;
    this.fechaActualizacion = new Date().toISOString();
  }

  setLinkedin(linkedin: string | null): void {
    this.linkedin = linkedin;
    this.fechaActualizacion = new Date().toISOString();
  }

  setYoutube(youtube: string | null): void {
    this.youtube = youtube;
    this.fechaActualizacion = new Date().toISOString();
  }

  setMoneda(moneda: string): void {
    this.moneda = moneda;
    this.fechaActualizacion = new Date().toISOString();
  }

  setPais(pais: string): void {
    this.pais = pais;
    this.fechaActualizacion = new Date().toISOString();
  }

  setZonaHoraria(zonaHoraria: string): void {
    this.zonaHoraria = zonaHoraria;
    this.fechaActualizacion = new Date().toISOString();
  }

  setIdioma(idioma: string): void {
    this.idioma = idioma;
    this.fechaActualizacion = new Date().toISOString();
  }

  setCostoEnvioGratis(costoEnvioGratis: number | null): void {
    this.costoEnvioGratis = costoEnvioGratis;
    this.fechaActualizacion = new Date().toISOString();
  }

  setCostoEnvioEstandar(costoEnvioEstandar: number | null): void {
    this.costoEnvioEstandar = costoEnvioEstandar;
    this.fechaActualizacion = new Date().toISOString();
  }

  setTiempoEntrega(tiempoEntrega: string | null): void {
    this.tiempoEntrega = tiempoEntrega;
    this.fechaActualizacion = new Date().toISOString();
  }

  setMensajeBienvenida(mensajeBienvenida: string | null): void {
    this.mensajeBienvenida = mensajeBienvenida;
    this.fechaActualizacion = new Date().toISOString();
  }

  setMensajeDespedida(mensajeDespedida: string | null): void {
    this.mensajeDespedida = mensajeDespedida;
    this.fechaActualizacion = new Date().toISOString();
  }

  setActivo(activo: boolean): void {
    this.activo = activo;
    this.fechaActualizacion = new Date().toISOString();
  }

  // Métodos de utilidad
  getUrlWhatsApp(): string {
    return `https://wa.me/${this.whatsappNumber}`;
  }

  getUrlInstagram(): string | null {
    return this.instagram ? `https://instagram.com/${this.instagram}` : null;
  }

  getFormatoMoneda(): string {
    const formatos: { [key: string]: string } = {
      $: "USD",
      "€": "EUR",
      "£": "GBP",
      "¥": "JPY",
      ARS: "ARS",
    };
    return formatos[this.moneda] || this.moneda;
  }
}
