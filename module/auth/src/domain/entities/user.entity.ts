import { UUID } from "@hex-lib/core";

type UserConstructorParams = {
  id: UUID;
  email: string;
  password: string;
};

export class User {
  private readonly id: UUID;
  private email: string;
  private password: string;

  constructor(params: UserConstructorParams) {
    this.id = params.id;
    this.email = params.email;
    this.password = params.password;
  }

  getId(): UUID {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getPassword(): string {
    return this.password;
  }

  setPassword(password: string): void {
    this.password = password;
  }
}
