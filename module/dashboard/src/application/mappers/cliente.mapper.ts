import { UUID } from "@hex-lib/core";
import { Cliente } from "@/dashboard/src/domain/entities/cliente.entity";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import {
  ClienteDTO,
  DireccionDTO,
  PreferenciasDTO,
  UpdateClienteDTO,
} from "../dtos/cliente.dto";

export class ClienteMapper {
  static fromDynamoDB(item: Record<string, AttributeValue>): Cliente {
    const rawItem = unmarshall(item);
    return new Cliente({
      id: new UUID(rawItem.id),
      email: rawItem.email,
      nombre: rawItem.nombre,
      apellido: rawItem.apellido,
      telefono: rawItem.telefono,
      fechaNacimiento: rawItem.fechaNacimiento,
      genero: rawItem.genero,
      direcciones: rawItem.direcciones || [],
      preferencias: rawItem.preferencias || {
        notificacionesEmail: true,
        notificacionesSMS: false,
        newsletter: true,
      },
      fechaCreacion: rawItem.fechaCreacion,
      fechaActualizacion: new Date(rawItem.fechaActualizacion).toISOString(),
      ultimoAcceso: rawItem.ultimoAcceso,
      activo: rawItem.activo === "true",
    });
  }

  static toDynamoDB(cliente: Cliente): Record<string, AttributeValue> {
    const plainCliente = {
      id: cliente.getId().getValue(),
      email: cliente.getEmail(),
      nombre: cliente.getNombre(),
      apellido: cliente.getApellido(),
      telefono: cliente.getTelefono(),
      fechaNacimiento: cliente.getFechaNacimiento(),
      genero: cliente.getGenero(),
      direcciones: cliente.getDirecciones(),
      preferencias: cliente.getPreferencias(),
      fechaCreacion: cliente.getFechaCreacion(),
      fechaActualizacion: cliente.getFechaActualizacion(),
      ultimoAcceso: cliente.getUltimoAcceso(),
      activo: cliente.isActivo().toString(),
    };
    return marshall(plainCliente, {
      convertClassInstanceToMap: true,
      removeUndefinedValues: true,
    });
  }

  static toEntity(dto: UpdateClienteDTO, existingCliente?: Cliente): Cliente {
    const now = new Date().toISOString();

    return new Cliente({
      id: new UUID(dto.id),
      email: dto.email ?? (existingCliente?.getEmail() || ""),
      nombre: dto.nombre ?? (existingCliente?.getNombre() || ""),
      apellido: dto.apellido ?? (existingCliente?.getApellido() || ""),
      telefono: dto.telefono ?? (existingCliente?.getTelefono() || ""),
      fechaNacimiento:
        dto.fechaNacimiento ?? existingCliente?.getFechaNacimiento(),
      genero: dto.genero ?? existingCliente?.getGenero(),
      direcciones: dto.direcciones
        ? dto.direcciones.map((dir) => ({
            id: dir.id,
            nombre: dir.nombre,
            apellido: dir.apellido,
            direccion: dir.direccion,
            ciudad: dir.ciudad,
            provincia: dir.provincia,
            codigoPostal: dir.codigoPostal,
            telefono: dir.telefono,
            email: dir.email,
            esPrincipal: dir.esPrincipal,
            instrucciones: dir.instrucciones,
          }))
        : existingCliente?.getDirecciones() || [],
      preferencias: dto.preferencias
        ? {
            notificacionesEmail: dto.preferencias.notificacionesEmail,
            notificacionesSMS: dto.preferencias.notificacionesSMS,
            newsletter: dto.preferencias.newsletter,
          }
        : existingCliente?.getPreferencias() || {
            notificacionesEmail: true,
            notificacionesSMS: false,
            newsletter: true,
          },
      fechaCreacion: existingCliente?.getFechaCreacion() || now,
      fechaActualizacion: now,
      ultimoAcceso: existingCliente?.getUltimoAcceso(),
      activo: dto.activo ?? existingCliente?.isActivo() ?? true,
    });
  }

  static toDTO(cliente: Cliente): ClienteDTO {
    return new ClienteDTO({
      id: cliente.getId().getValue(),
      email: cliente.getEmail(),
      nombre: cliente.getNombre(),
      apellido: cliente.getApellido(),
      telefono: cliente.getTelefono(),
      fechaNacimiento: cliente.getFechaNacimiento(),
      genero: cliente.getGenero(),
      direcciones: cliente.getDirecciones().map(
        (dir) =>
          new DireccionDTO({
            id: dir.id,
            nombre: dir.nombre,
            apellido: dir.apellido,
            direccion: dir.direccion,
            ciudad: dir.ciudad,
            provincia: dir.provincia,
            codigoPostal: dir.codigoPostal,
            telefono: dir.telefono,
            email: dir.email,
            esPrincipal: dir.esPrincipal,
            instrucciones: dir.instrucciones,
          })
      ),
      preferencias: new PreferenciasDTO(cliente.getPreferencias()),
      fechaCreacion: cliente.getFechaCreacion(),
      fechaActualizacion: cliente.getFechaActualizacion(),
      ultimoAcceso: cliente.getUltimoAcceso(),
      activo: cliente.isActivo(),
    });
  }
}
