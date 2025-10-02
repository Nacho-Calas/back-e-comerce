import { UUID } from "@hex-lib/core";
import { Configuracion } from "@/dashboard/domain/entities/configuracion.entity";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import {
  ConfiguracionDTO,
  UpdateConfiguracionDTO,
} from "../dtos/configuracion.dto";

export class ConfiguracionMapper {
  static fromDynamoDB(item: Record<string, AttributeValue>): Configuracion {
    const rawItem = unmarshall(item);
    return new Configuracion({
      id: new UUID(rawItem.id),
      nombreEmpresa: rawItem.nombreEmpresa,
      descripcion: rawItem.descripcion,
      logo: rawItem.logo || null,
      favicon: rawItem.favicon || null,
      whatsappNumber: rawItem.whatsappNumber,
      telefono: rawItem.telefono || null,
      email: rawItem.email || null,
      direccion: rawItem.direccion || null,
      instagram: rawItem.instagram || null,
      facebook: rawItem.facebook || null,
      linkedin: rawItem.linkedin || null,
      youtube: rawItem.youtube || null,
      moneda: rawItem.moneda,
      pais: rawItem.pais,
      zonaHoraria: rawItem.zonaHoraria,
      idioma: rawItem.idioma,
      costoEnvioGratis: rawItem.costoEnvioGratis || null,
      costoEnvioEstandar: rawItem.costoEnvioEstandar || null,
      tiempoEntrega: rawItem.tiempoEntrega || null,
      mensajeBienvenida: rawItem.mensajeBienvenida || null,
      mensajeDespedida: rawItem.mensajeDespedida || null,
      fechaCreacion: rawItem.fechaCreacion,
      fechaActualizacion: new Date(rawItem.fechaActualizacion).toISOString(),
      activo: rawItem.activo === "true",
    });
  }

  static toDynamoDB(configuracion: Configuracion): Record<string, AttributeValue> {
    const plainConfiguracion = {
      id: configuracion.getId().getValue(),
      nombreEmpresa: configuracion.getNombreEmpresa(),
      descripcion: configuracion.getDescripcion(),
      logo: configuracion.getLogo(),
      favicon: configuracion.getFavicon(),
      whatsappNumber: configuracion.getWhatsappNumber(),
      telefono: configuracion.getTelefono(),
      email: configuracion.getEmail(),
      direccion: configuracion.getDireccion(),
      instagram: configuracion.getInstagram(),
      facebook: configuracion.getFacebook(),
      linkedin: configuracion.getLinkedin(),
      youtube: configuracion.getYoutube(),
      moneda: configuracion.getMoneda(),
      pais: configuracion.getPais(),
      zonaHoraria: configuracion.getZonaHoraria(),
      idioma: configuracion.getIdioma(),
      costoEnvioGratis: configuracion.getCostoEnvioGratis(),
      costoEnvioEstandar: configuracion.getCostoEnvioEstandar(),
      tiempoEntrega: configuracion.getTiempoEntrega(),
      mensajeBienvenida: configuracion.getMensajeBienvenida(),
      mensajeDespedida: configuracion.getMensajeDespedida(),
      fechaCreacion: configuracion.getFechaCreacion(),
      fechaActualizacion: configuracion.getFechaActualizacion(),
      activo: configuracion.isActivo().toString(),
    };
    return marshall(plainConfiguracion, {
      convertClassInstanceToMap: true,
      removeUndefinedValues: true,
    });
  }

  static toEntity(dto: UpdateConfiguracionDTO, existingConfiguracion?: Configuracion): Configuracion {
    const now = new Date().toISOString();

    return new Configuracion({
      id: new UUID(dto.id),
      nombreEmpresa: dto.nombreEmpresa ?? (existingConfiguracion?.getNombreEmpresa() || ""),
      descripcion: dto.descripcion ?? (existingConfiguracion?.getDescripcion() || ""),
      logo: dto.logo ?? existingConfiguracion?.getLogo(),
      favicon: dto.favicon ?? existingConfiguracion?.getFavicon(),
      whatsappNumber: dto.whatsappNumber ?? (existingConfiguracion?.getWhatsappNumber() || ""),
      telefono: dto.telefono ?? existingConfiguracion?.getTelefono(),
      email: dto.email ?? existingConfiguracion?.getEmail(),
      direccion: dto.direccion ?? existingConfiguracion?.getDireccion(),
      instagram: dto.instagram ?? existingConfiguracion?.getInstagram(),
      facebook: dto.facebook ?? existingConfiguracion?.getFacebook(),
      linkedin: dto.linkedin ?? existingConfiguracion?.getLinkedin(),
      youtube: dto.youtube ?? existingConfiguracion?.getYoutube(),
      moneda: dto.moneda ?? (existingConfiguracion?.getMoneda() || "$"),
      pais: dto.pais ?? (existingConfiguracion?.getPais() || "Argentina"),
      zonaHoraria: dto.zonaHoraria ?? (existingConfiguracion?.getZonaHoraria() || "America/Argentina/Buenos_Aires"),
      idioma: dto.idioma ?? (existingConfiguracion?.getIdioma() || "es"),
      costoEnvioGratis: dto.costoEnvioGratis ?? existingConfiguracion?.getCostoEnvioGratis(),
      costoEnvioEstandar: dto.costoEnvioEstandar ?? existingConfiguracion?.getCostoEnvioEstandar(),
      tiempoEntrega: dto.tiempoEntrega ?? existingConfiguracion?.getTiempoEntrega(),
      mensajeBienvenida: dto.mensajeBienvenida ?? existingConfiguracion?.getMensajeBienvenida(),
      mensajeDespedida: dto.mensajeDespedida ?? existingConfiguracion?.getMensajeDespedida(),
      fechaCreacion: existingConfiguracion?.getFechaCreacion() || now,
      fechaActualizacion: now,
      activo: dto.activo ?? existingConfiguracion?.isActivo() ?? true,
    });
  }

  static toDTO(configuracion: Configuracion): ConfiguracionDTO {
    return new ConfiguracionDTO({
      id: configuracion.getId().getValue(),
      nombreEmpresa: configuracion.getNombreEmpresa(),
      descripcion: configuracion.getDescripcion(),
      logo: configuracion.getLogo(),
      favicon: configuracion.getFavicon(),
      whatsappNumber: configuracion.getWhatsappNumber(),
      telefono: configuracion.getTelefono(),
      email: configuracion.getEmail(),
      direccion: configuracion.getDireccion(),
      instagram: configuracion.getInstagram(),
      facebook: configuracion.getFacebook(),
      linkedin: configuracion.getLinkedin(),
      youtube: configuracion.getYoutube(),
      moneda: configuracion.getMoneda(),
      pais: configuracion.getPais(),
      zonaHoraria: configuracion.getZonaHoraria(),
      idioma: configuracion.getIdioma(),
      costoEnvioGratis: configuracion.getCostoEnvioGratis(),
      costoEnvioEstandar: configuracion.getCostoEnvioEstandar(),
      tiempoEntrega: configuracion.getTiempoEntrega(),
      mensajeBienvenida: configuracion.getMensajeBienvenida(),
      mensajeDespedida: configuracion.getMensajeDespedida(),
      fechaCreacion: configuracion.getFechaCreacion(),
      fechaActualizacion: configuracion.getFechaActualizacion(),
      activo: configuracion.isActivo(),
    });
  }
}
