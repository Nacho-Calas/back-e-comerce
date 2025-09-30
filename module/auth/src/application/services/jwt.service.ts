import {
  Service,
  ServiceDecorator,
  type ServiceDependencies,
} from "@hex-lib/core";
import jwt from "jsonwebtoken";

export interface JwtServiceDependencies extends Partial<ServiceDependencies> {
  vars: {
    JWT_SECRET: string;
  };
}

const jwtServiceDependencies: JwtServiceDependencies = {
  vars: {
    JWT_SECRET: process.env.JWT_SECRET!,
  },
};

@ServiceDecorator(jwtServiceDependencies)
export class JwtService extends Service<JwtServiceDependencies> {
  async sign(payload: object): Promise<string> {
    const secret = this.getVar("JWT_SECRET");
    return jwt.sign(payload, secret, { expiresIn: "1h" });
  }

  async verify(token: string): Promise<any> {
    const secret = this.getVar("JWT_SECRET");
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
