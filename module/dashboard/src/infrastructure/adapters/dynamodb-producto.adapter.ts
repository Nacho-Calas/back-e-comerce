import {
  Adapter,
  AdapterDecorator,
  type AdapterDependencies,
} from "@hex-lib/core";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { ProductoMapper } from "@/dashboard/application/mappers/producto.mapper";
import { Producto } from "@/dashboard/domain/entities/producto.entity";
import { IProductoPort } from "@/dashboard/infrastructure/ports/producto_port";
import { CategoriaProductoEnum } from "@/dashboard/domain/enums/categoria_producto.enum";

export interface DynamoDBProductoAdapterDependencies
  extends Partial<AdapterDependencies> {
  vars: {
    PRODUCTOS_TABLE: string;
    dynamoClient: DynamoDBClient;
  };
}

const dynamoDBProductoAdapterDependencies: DynamoDBProductoAdapterDependencies =
  {
    vars: {
      PRODUCTOS_TABLE: process.env.PRODUCTOS_TABLE || "",
      dynamoClient: new DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-2",
      }),
    },
  };

@AdapterDecorator(dynamoDBProductoAdapterDependencies)
export class DynamoDBProductoAdapter
  extends Adapter<DynamoDBProductoAdapterDependencies>
  implements IProductoPort
{
  async createProducto(producto: Producto): Promise<void> {
    try {
      this.getLogger().info({
        message: "Creando producto en DynamoDB",
        context: this.getContext(),
        metadata: { productoId: producto.getId().getValue() },
      });

      console.log("=== DYNAMODB ADAPTER - CREATE PRODUCTO ===");
      console.log(
        "Producto entity received:",
        JSON.stringify(
          {
            id: producto.getId().getValue(),
            nombre: producto.getNombre(),
            categoria: producto.getCategoria(),
            precio: producto.getPrecio(),
          },
          null,
          2
        )
      );

      console.log("Converting producto to DynamoDB format...");
      const item = ProductoMapper.toDynamoDB(producto);
      console.log("DynamoDB item created:", JSON.stringify(item, null, 2));

      console.log("Table name:", this.getVar("PRODUCTOS_TABLE"));
      console.log("AWS Region:", process.env.AWS_REGION);

      console.log("Sending PutItemCommand to DynamoDB...");
      const result = await this.getVar("dynamoClient").send(
        new PutItemCommand({
          TableName: this.getVar("PRODUCTOS_TABLE"),
          Item: item,
        })
      );
      console.log(
        "DynamoDB PutItemCommand result:",
        JSON.stringify(result, null, 2)
      );

      this.getLogger().info({
        message: "Producto creado exitosamente en DynamoDB",
        context: this.getContext(),
        metadata: { productoId: producto.getId().getValue() },
      });

      console.log("=== DYNAMODB ADAPTER - SUCCESS ===");
    } catch (error) {
      console.log("=== DYNAMODB ADAPTER - ERROR ===");
      console.error("Error creating producto in DynamoDB:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
        name: error instanceof Error ? error.name : "Unknown error type",
      });

      this.getLogger().error({
        message: "Error creando producto en DynamoDB",
        context: this.getContext(),
        metadata: {
          productoId: producto.getId().getValue(),
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });

      throw error;
    }
  }

  async getProductoById(id: string): Promise<Producto | null> {
    this.getLogger().info({
      message: "Obteniendo producto por ID desde DynamoDB",
      context: this.getContext(),
      metadata: { productoId: id },
    });

    const result = await this.getVar("dynamoClient").send(
      new GetItemCommand({
        TableName: this.getVar("PRODUCTOS_TABLE"),
        Key: {
          id: { S: id },
        },
      })
    );

    if (!result.Item) {
      this.getLogger().warn({
        message: "Producto no encontrado",
        context: this.getContext(),
        metadata: { productoId: id },
      });
      return null;
    }

    const producto = ProductoMapper.fromDynamoDB(result.Item);

    this.getLogger().info({
      message: "Producto obtenido exitosamente",
      context: this.getContext(),
      metadata: { productoId: producto.getId().getValue() },
    });

    return producto;
  }

  async getAllProductos(): Promise<Producto[] | null> {
    this.getLogger().info({
      message: "Obteniendo todos los productos desde DynamoDB",
      context: this.getContext(),
    });

    const result = await this.getVar("dynamoClient").send(
      new ScanCommand({
        TableName: this.getVar("PRODUCTOS_TABLE"),
        FilterExpression: "activo = :activo",
        ExpressionAttributeValues: {
          ":activo": { S: "true" },
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      this.getLogger().warn({
        message: "No se encontraron productos",
        context: this.getContext(),
      });
      return null;
    }

    const productos = result.Items.map((item) =>
      ProductoMapper.fromDynamoDB(item)
    );

    this.getLogger().info({
      message: "Productos obtenidos exitosamente",
      context: this.getContext(),
      metadata: { count: productos.length },
    });

    return productos;
  }

  async getProductosByCategoria(
    categoria: CategoriaProductoEnum
  ): Promise<Producto[] | null> {
    this.getLogger().info({
      message: "Obteniendo productos por categoría desde DynamoDB",
      context: this.getContext(),
      metadata: { categoria },
    });

    const result = await this.getVar("dynamoClient").send(
      new QueryCommand({
        TableName: this.getVar("PRODUCTOS_TABLE"),
        IndexName: "categoria-index",
        KeyConditionExpression: "categoria = :categoria",
        FilterExpression: "activo = :activo",
        ExpressionAttributeValues: {
          ":categoria": { S: categoria },
          ":activo": { S: "true" },
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      this.getLogger().warn({
        message: "No se encontraron productos para la categoría",
        context: this.getContext(),
        metadata: { categoria },
      });
      return null;
    }

    const productos = result.Items.map((item) =>
      ProductoMapper.fromDynamoDB(item)
    );

    this.getLogger().info({
      message: "Productos por categoría obtenidos exitosamente",
      context: this.getContext(),
      metadata: { categoria, count: productos.length },
    });

    return productos;
  }

  async getProductosDestacados(): Promise<Producto[] | null> {
    this.getLogger().info({
      message: "Obteniendo productos destacados desde DynamoDB",
      context: this.getContext(),
    });

    const result = await this.getVar("dynamoClient").send(
      new QueryCommand({
        TableName: this.getVar("PRODUCTOS_TABLE"),
        IndexName: "destacado-index",
        KeyConditionExpression: "destacado = :destacado",
        FilterExpression: "activo = :activo",
        ExpressionAttributeValues: {
          ":destacado": { S: "true" },
          ":activo": { S: "true" },
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      this.getLogger().warn({
        message: "No se encontraron productos destacados",
        context: this.getContext(),
      });
      return null;
    }

    const productos = result.Items.map((item) =>
      ProductoMapper.fromDynamoDB(item)
    );

    this.getLogger().info({
      message: "Productos destacados obtenidos exitosamente",
      context: this.getContext(),
      metadata: { count: productos.length },
    });

    return productos;
  }

  async buscarProductos(termino: string): Promise<Producto[] | null> {
    this.getLogger().info({
      message: "Buscando productos en DynamoDB",
      context: this.getContext(),
      metadata: { termino },
    });

    // Obtener todos los productos activos
    const result = await this.getVar("dynamoClient").send(
      new ScanCommand({
        TableName: this.getVar("PRODUCTOS_TABLE"),
        FilterExpression: "activo = :activo",
        ExpressionAttributeValues: {
          ":activo": { S: "true" },
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      this.getLogger().warn({
        message: "No se encontraron productos activos",
        context: this.getContext(),
      });
      return null;
    }

    // Convertir a entidades Producto
    const todosLosProductos = result.Items.map((item) =>
      ProductoMapper.fromDynamoDB(item)
    );

    // Filtrar en memoria con búsqueda case-insensitive
    const terminoLower = termino.toLowerCase();
    const productosFiltrados = todosLosProductos.filter((producto) => {
      const nombre = producto.getNombre().toLowerCase();
      const descripcion = producto.getDescripcion().toLowerCase();
      const categoria = producto.getCategoria().toLowerCase();
      
      return (
        nombre.includes(terminoLower) ||
        descripcion.includes(terminoLower) ||
        categoria.includes(terminoLower)
      );
    });

    if (productosFiltrados.length === 0) {
      this.getLogger().warn({
        message: "No se encontraron productos para el término de búsqueda",
        context: this.getContext(),
        metadata: { termino },
      });
      return null;
    }

    this.getLogger().info({
      message: "Búsqueda de productos completada exitosamente",
      context: this.getContext(),
      metadata: { termino, count: productosFiltrados.length },
    });

    return productosFiltrados;
  }

  async updateProducto(producto: Producto): Promise<void> {
    this.getLogger().info({
      message: "Actualizando producto en DynamoDB",
      context: this.getContext(),
      metadata: { productoId: producto.getId().getValue() },
    });

    const item = ProductoMapper.toDynamoDB(producto);

    await this.getVar("dynamoClient").send(
      new PutItemCommand({
        TableName: this.getVar("PRODUCTOS_TABLE"),
        Item: item,
      })
    );

    this.getLogger().info({
      message: "Producto actualizado exitosamente en DynamoDB",
      context: this.getContext(),
      metadata: { productoId: producto.getId().getValue() },
    });
  }

  async deleteProducto(id: string): Promise<void> {
    this.getLogger().info({
      message: "Eliminando producto (soft delete) en DynamoDB",
      context: this.getContext(),
      metadata: { productoId: id },
    });

    await this.getVar("dynamoClient").send(
      new UpdateItemCommand({
        TableName: this.getVar("PRODUCTOS_TABLE"),
        Key: {
          id: { S: id },
        },
        UpdateExpression:
          "SET activo = :activo, fechaActualizacion = :fechaActualizacion",
        ExpressionAttributeValues: {
          ":activo": { S: "false" },
          ":fechaActualizacion": { S: new Date().toISOString() },
        },
      })
    );

    this.getLogger().info({
      message: "Producto eliminado exitosamente (soft delete) en DynamoDB",
      context: this.getContext(),
      metadata: { productoId: id },
    });
  }

  async hardDeleteProducto(id: string): Promise<void> {
    this.getLogger().info({
      message: "Eliminando producto permanentemente de DynamoDB",
      context: this.getContext(),
      metadata: { productoId: id },
    });

    await this.getVar("dynamoClient").send(
      new DeleteItemCommand({
        TableName: this.getVar("PRODUCTOS_TABLE"),
        Key: {
          id: { S: id },
        },
      })
    );

    this.getLogger().info({
      message: "Producto eliminado permanentemente de DynamoDB",
      context: this.getContext(),
      metadata: { productoId: id },
    });
  }
}
