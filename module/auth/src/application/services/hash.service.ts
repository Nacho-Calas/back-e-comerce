import {
  Service,
  ServiceDecorator,
  type ServiceDependencies,
} from "@hex-lib/core";
import bcrypt from "bcryptjs";

export interface HashServiceDependencies extends Partial<ServiceDependencies> {
  vars: {
    SALT_ROUNDS: number;
  };
}

const hashServiceDependencies: HashServiceDependencies = {
  vars: {
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || "10"),
  },
};

@ServiceDecorator(hashServiceDependencies)
export class HashService extends Service<HashServiceDependencies> {
  async hash(text: string): Promise<string> {
    return bcrypt.hash(text, this.getVar("SALT_ROUNDS"));
  }
  async compare(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }
}
