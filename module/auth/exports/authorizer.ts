import {
  APIGatewayRequestAuthorizerEvent,
  APIGatewayAuthorizerResult,
  APIGatewayAuthorizerWithContextResult,
} from "aws-lambda";
import { JwtService } from "@/auth/application/services/jwt.service";

export const authorize = async (
  event: APIGatewayRequestAuthorizerEvent
): Promise<
  APIGatewayAuthorizerResult | APIGatewayAuthorizerWithContextResult<any>
> => {
  try {
    // Extraer el token del header Authorization
    const token =
      event.headers?.Authorization?.replace("Bearer ", "") ||
      event.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No token provided");
    }

    // Verificar el token usando JwtService
    const jwtService = new JwtService();
    const decoded = await jwtService.verify(token);

    // Generar policy de autorización para HTTP API
    const policy: APIGatewayAuthorizerResult = {
      principalId: decoded.id,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: event.methodArn || "*",
          },
        ],
      },
      context: {
        userId: decoded.id,
        email: decoded.email,
      },
    };

    return policy;
  } catch (error) {
    console.error("Authorization failed:", error);

    // Retornar policy de denegación
    return {
      principalId: "unauthorized",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: event.methodArn || "*",
          },
        ],
      },
    };
  }
};
