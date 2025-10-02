import { ConfiguracionMapper } from "@/dashboard/application/mappers/configuracion.mapper";
import { Configuracion } from "@/dashboard/domain/entities/configuracion.entity";
import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import {
  Adapter,
  AdapterDecorator,
  type AdapterDependencies,
  IContextuable,
  ILoggeable,
  IThrowable,
} from "@hex-lib/core";
import { IConfiguracionPort } from "../ports/configuracion_port";

export interface ConfiguracionAdapterDependencies
  extends Partial<AdapterDependencies> {
  vars: {
    CONFIGURACION_TABLE: string;
    dynamoClient: DynamoDBClient;
  };
}

const configuracionAdapterDependencies: ConfiguracionAdapterDependencies = {
  vars: {
    CONFIGURACION_TABLE: process.env.CONFIGURACION_TABLE || "",
    dynamoClient: new DynamoDBClient({}),
  },
};

@AdapterDecorator(configuracionAdapterDependencies)
export class DynamoDBConfiguracionAdapter
  extends Adapter<ConfiguracionAdapterDependencies>
  implements IConfiguracionPort, IContextuable, ILoggeable, IThrowable
{
  async createConfiguracion(configuracion: Configuracion): Promise<void> {
    this.getLogger().info({
      message: "Creando configuración en DynamoDB",
      context: this.getContext(),
      metadata: { configuracionId: configuracion.getId().getValue() },
    });

    const item = ConfiguracionMapper.toDynamoDB(configuracion);

    await this.getVar("dynamoClient").send(
      new PutItemCommand({
        TableName: this.getVar("CONFIGURACION_TABLE"),
        Item: item,
      })
    );

    this.getLogger().info({
      message: "Configuración creada exitosamente",
      context: this.getContext(),
      metadata: { configuracionId: configuracion.getId().getValue() },
    });
  }

  async getConfiguracionById(id: string): Promise<Configuracion | null> {
    this.getLogger().info({
      message: "Obteniendo configuración por ID desde DynamoDB",
      context: this.getContext(),
      metadata: { configuracionId: id },
    });

    const result = await this.getVar("dynamoClient").send(
      new GetItemCommand({
        TableName: this.getVar("CONFIGURACION_TABLE"),
        Key: {
          id: { S: id },
        },
      })
    );

    if (!result.Item) {
      this.getLogger().warn({
        message: "Configuración no encontrada",
        context: this.getContext(),
        metadata: { configuracionId: id },
      });
      return null;
    }

    const configuracion = ConfiguracionMapper.fromDynamoDB(result.Item);

    this.getLogger().info({
      message: "Configuración obtenida exitosamente",
      context: this.getContext(),
      metadata: { configuracionId: id },
    });

    return configuracion;
  }

  async getConfiguracionActiva(): Promise<Configuracion | null> {
    this.getLogger().info({
      message: "Obteniendo configuración activa desde DynamoDB",
      context: this.getContext(),
    });

    const result = await this.getVar("dynamoClient").send(
      new ScanCommand({
        TableName: this.getVar("CONFIGURACION_TABLE"),
        FilterExpression: "activo = :activo",
        ExpressionAttributeValues: {
          ":activo": { S: "true" },
        },
        Limit: 1,
      })
    );

    if (!result.Items || result.Items.length === 0) {
      this.getLogger().warn({
        message: "No se encontró configuración activa",
        context: this.getContext(),
      });
      return null;
    }

    const configuracion = ConfiguracionMapper.fromDynamoDB(result.Items[0]);

    this.getLogger().info({
      message: "Configuración activa obtenida exitosamente",
      context: this.getContext(),
      metadata: { configuracionId: configuracion.getId().getValue() },
    });

    return configuracion;
  }

  async updateConfiguracion(configuracion: Configuracion): Promise<void> {
    this.getLogger().info({
      message: "Actualizando configuración en DynamoDB",
      context: this.getContext(),
      metadata: { configuracionId: configuracion.getId().getValue() },
    });

    const item = ConfiguracionMapper.toDynamoDB(configuracion);

    await this.getVar("dynamoClient").send(
      new PutItemCommand({
        TableName: this.getVar("CONFIGURACION_TABLE"),
        Item: item,
      })
    );

    this.getLogger().info({
      message: "Configuración actualizada exitosamente",
      context: this.getContext(),
      metadata: { configuracionId: configuracion.getId().getValue() },
    });
  }

  async deleteConfiguracion(id: string): Promise<void> {
    this.getLogger().info({
      message: "Eliminando configuración desde DynamoDB",
      context: this.getContext(),
      metadata: { configuracionId: id },
    });

    await this.getVar("dynamoClient").send(
      new DeleteItemCommand({
        TableName: this.getVar("CONFIGURACION_TABLE"),
        Key: {
          id: { S: id },
        },
      })
    );

    this.getLogger().info({
      message: "Configuración eliminada exitosamente",
      context: this.getContext(),
      metadata: { configuracionId: id },
    });
  }
}
