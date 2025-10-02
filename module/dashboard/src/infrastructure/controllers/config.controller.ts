import {
  IContextuable,
  ILoggeable,
  IThrowable,
  Controller,
  AdapterDecorator,
  type AdapterDependencies,
} from "@hex-lib/core";
import { ConfiguracionService } from "@/dashboard/application/services/configuracion.service";
import {
  UpdateConfiguracionDTO,
  ConfiguracionDTO,
} from "@/dashboard/application/dtos/configuracion.dto";

export interface ConfigControllerDependencies
  extends Partial<AdapterDependencies> {
  services: {
    configuracionService: ConfiguracionService;
  };
}

const configControllerDependencies: ConfigControllerDependencies = {
  services: {
    configuracionService: new ConfiguracionService(),
  },
};

@AdapterDecorator(configControllerDependencies)
export class ConfigController
  extends Controller<ConfigControllerDependencies>
  implements IContextuable, IThrowable, ILoggeable
{
  /**
   * Obtener configuración activa para el frontend
   */
  async getConfiguracionActiva(): Promise<ConfiguracionDTO | null> {
    this.getLogger().info({
      message: "Solicitud de configuración activa",
      context: this.getContext(),
    });

    const configuracionService = this.getService("configuracionService");
    const result = await configuracionService.getConfiguracionActiva();

    if (!result) {
      this.getLogger().warn({
        message: "No se encontró configuración activa",
        context: this.getContext(),
      });
    } else {
      this.getLogger().info({
        message: "Configuración activa obtenida exitosamente",
        context: this.getContext(),
        metadata: { configuracionId: result.id },
      });
    }

    return result;
  }

  /**
   * Actualizar configuración (para admin)
   */
  async updateConfiguracion(
    dto: UpdateConfiguracionDTO
  ): Promise<ConfiguracionDTO> {
    this.getLogger().info({
      message: "Solicitud de actualización de configuración",
      context: this.getContext(),
      metadata: { configuracionId: dto.id },
    });

    const configuracionService = this.getService("configuracionService");
    const result = await configuracionService.updateConfiguracion(dto);

    this.getLogger().info({
      message: "Configuración actualizada exitosamente",
      context: this.getContext(),
      metadata: { configuracionId: result.id },
    });

    return result;
  }
}
