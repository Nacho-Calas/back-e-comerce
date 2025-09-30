import { User } from "@/auth/src/domain/entities/user.entity";
import { IPort } from "@hex-lib/core";

export interface IUserRepositoryPort extends IPort {
  findByEmail(email: string): Promise<User | null>;
}
