import {
  ConfiguracionDTO,
  UpdateConfiguracionDTO,
} from "@/dashboard/application/dtos/configuracion.dto";
import { ConfiguracionMapper } from "@/dashboard/application/mappers/configuracion.mapper";
import { DynamoDBConfiguracionAdapter } from "@/dashboard/infrastructure/adapters/dynamodb-configuracion.adapter";
import { IConfiguracionPort } from "@/dashboard/infrastructure/ports/configuracion_port";
import {
  IContextuable,
  ILoggeable,
  Service,
  ServiceDecorator,
  type ServiceDependencies,
} from "@hex-lib/core";

interface ConfiguracionServiceDependencies
  extends Partial<ServiceDependencies> {
  ports: {
    configuracionPort: IConfiguracionPort;
  };
}

const configuracionServiceDependencies: ConfiguracionServiceDependencies = {
  ports: {
    configuracionPort: new DynamoDBConfiguracionAdapter(),
  },
};

@ServiceDecorator(configuracionServiceDependencies)
export class ConfiguracionService
  extends Service<ConfiguracionServiceDependencies>
  implements IContextuable, ILoggeable
{
  /**
   * Obtener configuración activa (para el frontend)
   */
  async getConfiguracionActiva(): Promise<ConfiguracionDTO | null> {
    this.getLogger().info({
      message: "Obteniendo configuración activa",
      context: this.getContext(),
    });

    const configuracionPort = this.getPort("configuracionPort");
    const configuracion = await configuracionPort.getConfiguracionActiva();

    if (!configuracion) {
      this.getLogger().warn({
        message: "No se encontró configuración activa",
        context: this.getContext(),
      });
      return null;
    }

    this.getLogger().info({
      message: "Configuración activa obtenida exitosamente",
      context: this.getContext(),
      metadata: { configuracionId: configuracion.getId().getValue() },
    });

    return ConfiguracionMapper.toDTO(configuracion);
  }

  /**
   * Actualizar configuración
   */
  async updateConfiguracion(
    dto: UpdateConfiguracionDTO
  ): Promise<ConfiguracionDTO> {
    this.getLogger().info({
      message: "Actualizando configuración",
      context: this.getContext(),
      metadata: { configuracionId: dto.id },
    });

    const configuracionPort = this.getPort("configuracionPort");

    // Obtener configuración existente
    const existingConfiguracion = await configuracionPort.getConfiguracionById(
      dto.id
    );
    if (!existingConfiguracion) {
      throw new Error("Configuración no encontrada");
    }

    // Crear configuración actualizada
    const updatedConfiguracion = ConfiguracionMapper.toEntity(
      dto,
      existingConfiguracion
    );

    await configuracionPort.updateConfiguracion(updatedConfiguracion);

    this.getLogger().info({
      message: "Configuración actualizada exitosamente",
      context: this.getContext(),
      metadata: { configuracionId: dto.id },
    });

    return ConfiguracionMapper.toDTO(updatedConfiguracion);
  }
}
