import "reflect-metadata";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ConfigController } from "../src/infrastructure/controllers/config.controller";
import { UpdateConfiguracionDTO } from "../src/application/dtos/configuracion.dto";
import { formatErrorResponse } from "../../../lib/error-helper";

// GET /configuracion - Obtener configuración activa (para frontend)
export const getConfiguracion = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const configController = new ConfigController();

  try {
    const result = await configController.getConfiguracionActiva();

    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "No se encontró configuración activa",
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
    const exceptionManager = configController.getExceptionManager();
    exceptionManager.handleException(error, configController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};

// PUT /configuracion - Actualizar configuración (para admin)
export const updateConfiguracion = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const configController = new ConfigController();

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Body requerido",
        }),
      };
    }

    const dto = new UpdateConfiguracionDTO(JSON.parse(event.body));
    const result = await configController.updateConfiguracion(dto);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    const exceptionManager = configController.getExceptionManager();
    exceptionManager.handleException(error, configController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};
