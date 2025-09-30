import "reflect-metadata";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { AuthController } from "@/auth/infrastructure/controllers/auth.controller";
import { LoginInputDTO } from "@/auth/application/dtos/login_input.dto";
import { formatErrorResponse } from "../../../lib/error-helper";

export const login = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const authController = new AuthController();
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Body requerido" }),
      };
    }

    const body = JSON.parse(event.body);
    const credentials = new LoginInputDTO(body);
    const result = await authController.authenticate(credentials);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    const exceptionManager = authController.getExceptionManager();
    exceptionManager.handleException(error, authController.getContext());
    return formatErrorResponse(
      exceptionManager.getExceptions(),
      exceptionManager.getPrincipalStatus()
    );
  }
};
