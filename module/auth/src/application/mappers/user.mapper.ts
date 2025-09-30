import { UUID } from "@hex-lib/core";
import { User } from "@/auth/domain/entities/user.entity";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export class UserMapper {
  static fromDynamoDB(user: Record<string, AttributeValue>): User {
    const rawUser = unmarshall(user);
    return new User({
      id: new UUID(rawUser.id),
      email: rawUser.email,
      password: rawUser.password,
    });
  }
}
