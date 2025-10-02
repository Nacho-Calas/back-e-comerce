import "reflect-metadata";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ArchivoController } from "../src/infrastructure/controllers/archivo.controller";
import { formatErrorResponse } from "../../../lib/error-helper";

/**
 * Generar presigned URL para subir archivo a S3
 */
export const generarPresignedUrl = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const archivoController = new ArchivoController();
  try {
    const result = await archivoController.generarPresignedUrl(event);
    return result;
  } catch (error) {
    const exceptionManager = archivoController.getExceptionManager();
    exceptionManager.handleException(error, archivoController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};
