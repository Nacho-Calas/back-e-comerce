import { User } from "@/auth/domain/entities/user.entity";
import { IPort } from "@hex-lib/core";

export interface IUserRepositoryPort extends IPort {
  findByEmail(email: string): Promise<User | null>;
}
