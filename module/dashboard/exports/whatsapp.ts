import "reflect-metadata";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { WhatsAppController } from "../src/infrastructure/controllers/whatsapp.controller";
import { formatErrorResponse } from "../../../lib/error-helper";

/**
 * Generar mensaje de pedido desde el carrito
 */
export const generarMensajePedido = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const whatsappController = new WhatsAppController();
  try {
    const carritoId = event.pathParameters?.carritoId;
    if (!carritoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Carrito ID requerido",
        }),
      };
    }

    const result = await whatsappController.generarMensajePedido(carritoId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    const exceptionManager = whatsappController.getExceptionManager();
    exceptionManager.handleException(error, whatsappController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Generar mensaje de consulta para un producto específico
 */
export const generarMensajeConsulta = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const whatsappController = new WhatsAppController();
  try {
    const productoId = event.pathParameters?.productoId;
    if (!productoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Producto ID requerido",
        }),
      };
    }

    const result = await whatsappController.generarMensajeConsulta(productoId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    const exceptionManager = whatsappController.getExceptionManager();
    exceptionManager.handleException(error, whatsappController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

/**
 * Obtener configuración de WhatsApp
 */
export const getConfiguracion = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const whatsappController = new WhatsAppController();
  try {
    const result = await whatsappController.getConfiguracion();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    const exceptionManager = whatsappController.getExceptionManager();
    exceptionManager.handleException(error, whatsappController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};
