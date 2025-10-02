import {
  Adapter,
  AdapterDecorator,
  type AdapterDependencies,
} from "@hex-lib/core";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { UserMapper } from "@/auth/application/mappers/user.mapper";
import { User } from "@/auth/domain/entities/user.entity";
import { IUserRepositoryPort } from "@/auth/infrastructure/ports/user_repository.port";

export interface UserDynamoAdapterDependencies
  extends Partial<AdapterDependencies> {
  vars: {
    USERS_TABLE: string;
    dynamoClient: DynamoDBClient;
  };
}

const userDynamoAdapterDependencies: UserDynamoAdapterDependencies = {
  vars: {
    USERS_TABLE: process.env.USERS_TABLE || "",
    dynamoClient: new DynamoDBClient({
      region: "us-east-2",
    }),
  },
};

@AdapterDecorator(userDynamoAdapterDependencies)
export class UserDynamoAdapter
  extends Adapter<UserDynamoAdapterDependencies>
  implements IUserRepositoryPort
{
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.getVar("dynamoClient").send(
      new QueryCommand({
        TableName: this.getVar("USERS_TABLE"),
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": { S: email },
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const user = UserMapper.fromDynamoDB(result.Items[0]);

    this.getLogger().debug({
      message: "Datos del usuario obtenidos de DynamoDB",
      context: this.getContext(),
      metadata: {
        user,
      },
    });

    return user;
  }
}
