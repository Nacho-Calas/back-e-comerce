import "reflect-metadata";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { CarritoController } from "../src/infrastructure/controllers/carrito.controller";
import {
  CreateCarritoDTO,
  AgregarItemCarritoDTO,
  ActualizarCantidadItemDTO,
  EliminarItemCarritoDTO,
} from "../src/application/dtos/carrito.dto";
import { formatErrorResponse } from "../../../lib/error-helper";

/**
 * Crear un nuevo carrito
 */
export const createCarrito = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const carritoController = new CarritoController();
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Body requerido",
        }),
      };
    }

    const createDTO = new CreateCarritoDTO(JSON.parse(event.body));
    const result = await carritoController.createCarrito(createDTO);

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    const exceptionManager = carritoController.getExceptionManager();
    exceptionManager.handleException(error, carritoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Obtener carrito por ID
 */
export const getCarritoById = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const carritoController = new CarritoController();
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

    const result = await carritoController.getCarritoById(id);

    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Carrito no encontrado",
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
    const exceptionManager = carritoController.getExceptionManager();
    exceptionManager.handleException(error, carritoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Obtener carrito por usuario (sessionId)
 */
export const getCarritoByUsuario = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const carritoController = new CarritoController();
  try {
    const usuarioId = event.pathParameters?.usuarioId;
    if (!usuarioId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Usuario ID requerido",
        }),
      };
    }

    const result = await carritoController.getCarritoByUsuario(usuarioId);

    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Carrito no encontrado para este usuario",
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
    const exceptionManager = carritoController.getExceptionManager();
    exceptionManager.handleException(error, carritoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Agregar item al carrito
 */
export const agregarItem = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const carritoController = new CarritoController();
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Body requerido",
        }),
      };
    }

    const agregarDTO = new AgregarItemCarritoDTO(JSON.parse(event.body));
    const result = await carritoController.agregarItem(agregarDTO);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    const exceptionManager = carritoController.getExceptionManager();
    exceptionManager.handleException(error, carritoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Actualizar cantidad de item en el carrito
 */
export const actualizarCantidad = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const carritoController = new CarritoController();
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Body requerido",
        }),
      };
    }

    const actualizarDTO = new ActualizarCantidadItemDTO(JSON.parse(event.body));
    const result = await carritoController.actualizarCantidad(actualizarDTO);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    const exceptionManager = carritoController.getExceptionManager();
    exceptionManager.handleException(error, carritoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Eliminar item del carrito
 */
export const eliminarItem = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const carritoController = new CarritoController();
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Body requerido",
        }),
      };
    }

    const eliminarDTO = new EliminarItemCarritoDTO(JSON.parse(event.body));
    const result = await carritoController.eliminarItem(eliminarDTO);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    const exceptionManager = carritoController.getExceptionManager();
    exceptionManager.handleException(error, carritoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Limpiar carrito
 */
export const limpiarCarrito = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const carritoController = new CarritoController();
  try {
    const carritoId = event.pathParameters?.id;
    if (!carritoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Carrito ID requerido",
        }),
      };
    }

    const result = await carritoController.limpiarCarrito(carritoId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    const exceptionManager = carritoController.getExceptionManager();
    exceptionManager.handleException(error, carritoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};
