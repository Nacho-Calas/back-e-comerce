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
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Body requerido",
        }),
      };
    }

    const createDTO = new CreateProductoDTO(JSON.parse(event.body));
    const result = await productoController.createProducto(createDTO);

    return {
      statusCode: 201,
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
    const result = await productoController.getAllProductos();

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
    if (!categoria) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Categoría requerida",
        }),
      };
    }

    const result = await productoController.getProductosByCategoria(categoria);

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
    const result = await productoController.getProductosDestacados();

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
    if (!termino) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Término de búsqueda requerido",
        }),
      };
    }

    const result = await productoController.buscarProductos(termino);

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
