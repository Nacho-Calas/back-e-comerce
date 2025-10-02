import { IPort } from "@hex-lib/core";
import { Configuracion } from "@/dashboard/domain/entities/configuracion.entity";

export interface IConfiguracionPort extends IPort {
  createConfiguracion(configuracion: Configuracion): Promise<void>;
  getConfiguracionById(id: string): Promise<Configuracion | null>;
  getConfiguracionActiva(): Promise<Configuracion | null>;
  updateConfiguracion(configuracion: Configuracion): Promise<void>;
  deleteConfiguracion(id: string): Promise<void>;
}
