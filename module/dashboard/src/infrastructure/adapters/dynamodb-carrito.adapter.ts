import {
  Adapter,
  AdapterDecorator,
  type AdapterDependencies,
} from "@hex-lib/core";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { CarritoMapper } from "@/dashboard/application/mappers/carrito.mapper";
import { Carrito } from "@/dashboard/domain/entities/carrito.entity";
import { ICarritoPort } from "@/dashboard/infrastructure/ports/carrito_port";

export interface DynamoDBCarritoAdapterDependencies
  extends Partial<AdapterDependencies> {
  vars: {
    CARRITOS_TABLE: string;
    dynamoClient: DynamoDBClient;
  };
}

const dynamoDBCarritoAdapterDependencies: DynamoDBCarritoAdapterDependencies = {
  vars: {
    CARRITOS_TABLE: process.env.CARRITOS_TABLE || "",
    dynamoClient: new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-2",
    }),
  },
};

@AdapterDecorator(dynamoDBCarritoAdapterDependencies)
export class DynamoDBCarritoAdapter
  extends Adapter<DynamoDBCarritoAdapterDependencies>
  implements ICarritoPort
{
  async createCarrito(carrito: Carrito): Promise<void> {
    this.getLogger().info({
      message: "Creando carrito en DynamoDB",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });

    const item = CarritoMapper.toDynamoDB(carrito);

    await this.getVar("dynamoClient").send(
      new PutItemCommand({
        TableName: this.getVar("CARRITOS_TABLE"),
        Item: item,
      })
    );

    this.getLogger().info({
      message: "Carrito creado exitosamente en DynamoDB",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });
  }

  async getCarritoById(id: string): Promise<Carrito | null> {
    this.getLogger().info({
      message: "Obteniendo carrito por ID desde DynamoDB",
      context: this.getContext(),
      metadata: { carritoId: id },
    });

    const result = await this.getVar("dynamoClient").send(
      new GetItemCommand({
        TableName: this.getVar("CARRITOS_TABLE"),
        Key: {
          id: { S: id },
        },
      })
    );

    if (!result.Item) {
      this.getLogger().warn({
        message: "Carrito no encontrado",
        context: this.getContext(),
        metadata: { carritoId: id },
      });
      return null;
    }

    const carrito = CarritoMapper.fromDynamoDB(result.Item);

    this.getLogger().info({
      message: "Carrito obtenido exitosamente",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });

    return carrito;
  }

  async getCarritoBySession(sessionId: string): Promise<Carrito | null> {
    this.getLogger().info({
      message: "Obteniendo carrito por sesión desde DynamoDB",
      context: this.getContext(),
      metadata: { sessionId },
    });

    const result = await this.getVar("dynamoClient").send(
      new QueryCommand({
        TableName: this.getVar("CARRITOS_TABLE"),
        IndexName: "usuario-index",
        KeyConditionExpression: "sessionId = :sessionId",
        ExpressionAttributeValues: {
          ":sessionId": { S: sessionId },
        },
        Limit: 1,
      })
    );

    if (!result.Items || result.Items.length === 0) {
      this.getLogger().warn({
        message: "Carrito no encontrado para sesión",
        context: this.getContext(),
        metadata: { sessionId },
      });
      return null;
    }

    const carrito = CarritoMapper.fromDynamoDB(result.Items[0]);

    this.getLogger().info({
      message: "Carrito obtenido exitosamente para sesión",
      context: this.getContext(),
      metadata: {
        carritoId: carrito.getId().getValue(),
        sessionId,
      },
    });

    return carrito;
  }

  async updateCarrito(carrito: Carrito): Promise<void> {
    this.getLogger().info({
      message: "Actualizando carrito en DynamoDB",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });

    const item = CarritoMapper.toDynamoDB(carrito);

    await this.getVar("dynamoClient").send(
      new PutItemCommand({
        TableName: this.getVar("CARRITOS_TABLE"),
        Item: item,
      })
    );

    this.getLogger().info({
      message: "Carrito actualizado exitosamente en DynamoDB",
      context: this.getContext(),
      metadata: { carritoId: carrito.getId().getValue() },
    });
  }

  async deleteCarrito(id: string): Promise<void> {
    this.getLogger().info({
      message: "Eliminando carrito de DynamoDB",
      context: this.getContext(),
      metadata: { carritoId: id },
    });

    await this.getVar("dynamoClient").send(
      new DeleteItemCommand({
        TableName: this.getVar("CARRITOS_TABLE"),
        Key: {
          id: { S: id },
        },
      })
    );

    this.getLogger().info({
      message: "Carrito eliminado exitosamente de DynamoDB",
      context: this.getContext(),
      metadata: { carritoId: id },
    });
  }
}
