import "reflect-metadata";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ProductoController } from "../src/infrastructure/controllers/producto.controller";
import {
  CreateProductoDTO,
  UpdateProductoDTO,
} from "../src/application/dtos/producto.dto";
import { formatErrorResponse } from "../../../lib/error-helper";
import { CategoriaProductoEnum } from "../src/domain/enums/categoria_producto.enum";

/**
 * Crear un nuevo producto
 */
export const createProducto = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const productoController = new ProductoController();
  try {
    console.log("=== PRODUCTO CREATION START ===");
    console.log("Event received:", JSON.stringify(event, null, 2));

    if (!event.body) {
      console.log("ERROR: No body provided in request");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Body requerido",
        }),
      };
    }

    console.log("Parsing request body...");
    const bodyData = JSON.parse(event.body);
    console.log("Parsed body data:", JSON.stringify(bodyData, null, 2));

    console.log("Creating CreateProductoDTO...");
    const createDTO = new CreateProductoDTO(bodyData);
    console.log("CreateProductoDTO created successfully");

    console.log("Calling productoController.createProducto...");
    const result = await productoController.createProducto(createDTO);
    console.log(
      "Product created successfully:",
      JSON.stringify(result, null, 2)
    );

    console.log("=== PRODUCTO CREATION SUCCESS ===");
    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    console.log("=== PRODUCTO CREATION ERROR ===");
    console.error("Error details:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    const exceptionManager = productoController.getExceptionManager();
    exceptionManager.handleException(error, productoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Obtener un producto por ID
 */
export const getProductoById = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const productoController = new ProductoController();
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "ID requerido",
        }),
      };
    }

    const result = await productoController.getProductoById(id);

    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Producto no encontrado",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    const exceptionManager = productoController.getExceptionManager();
    exceptionManager.handleException(error, productoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Obtener todos los productos
 */
export const getAllProductos = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const productoController = new ProductoController();
  try {
    const includeInactive =
      event.queryStringParameters?.includeInactive === "true";
    const result = await productoController.getAllProductos(includeInactive);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result: result || [],
      }),
    };
  } catch (error) {
    const exceptionManager = productoController.getExceptionManager();
    exceptionManager.handleException(error, productoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Obtener productos por categoría
 */
export const getProductosByCategoria = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const productoController = new ProductoController();
  try {
    const categoria = event.pathParameters?.categoria as CategoriaProductoEnum;
    const includeInactive =
      event.queryStringParameters?.includeInactive === "true";
    if (!categoria) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Categoría requerida",
        }),
      };
    }

    const result = await productoController.getProductosByCategoria(
      categoria,
      includeInactive
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result: result || [],
      }),
    };
  } catch (error) {
    const exceptionManager = productoController.getExceptionManager();
    exceptionManager.handleException(error, productoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Obtener productos destacados
 */
export const getProductosDestacados = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const productoController = new ProductoController();
  try {
    const includeInactive =
      event.queryStringParameters?.includeInactive === "true";
    const result = await productoController.getProductosDestacados(
      includeInactive
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result: result || [],
      }),
    };
  } catch (error) {
    const exceptionManager = productoController.getExceptionManager();
    exceptionManager.handleException(error, productoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Buscar productos por término
 */
export const buscarProductos = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const productoController = new ProductoController();
  try {
    const termino = event.queryStringParameters?.q;
    const includeInactive =
      event.queryStringParameters?.includeInactive === "true";
    if (!termino) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Término de búsqueda requerido",
        }),
      };
    }

    const result = await productoController.buscarProductos(
      termino,
      includeInactive
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result: result || [],
      }),
    };
  } catch (error) {
    const exceptionManager = productoController.getExceptionManager();
    exceptionManager.handleException(error, productoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Actualizar un producto
 */
export const updateProducto = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const productoController = new ProductoController();
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Body requerido",
        }),
      };
    }

    const updateDTO = new UpdateProductoDTO(JSON.parse(event.body));
    await productoController.updateProducto(updateDTO);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Producto actualizado exitosamente",
      }),
    };
  } catch (error) {
    const exceptionManager = productoController.getExceptionManager();
    exceptionManager.handleException(error, productoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Eliminar un producto (soft delete)
 */
export const deleteProducto = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const productoController = new ProductoController();
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "ID requerido",
        }),
      };
    }

    await productoController.deleteProducto(id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Producto eliminado exitosamente",
      }),
    };
  } catch (error) {
    const exceptionManager = productoController.getExceptionManager();
    exceptionManager.handleException(error, productoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Obtener categorías disponibles
 */
export const getCategorias = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const productoController = new ProductoController();
  try {
    const result = await productoController.getCategorias();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    const exceptionManager = productoController.getExceptionManager();
    exceptionManager.handleException(error, productoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};
