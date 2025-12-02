import { UserDAO } from "../interfaces/UserDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDto } from "tweeter-shared";
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";

export class DynamoUserDAO implements UserDAO {
    readonly tableName = "tweeterUsers";
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    // ---------- GET ----------
    async getUser(alias: string): Promise<UserDto | null> {
        const params = { TableName: this.tableName, Key: { alias } };
        const output = await this.client.send(new GetCommand(params));
        if (output.Item) {
            console.log(`Retrieved user: ${alias}`);
        } else {
            console.log(`User not found: ${alias}`);
        }
        return output.Item ? (output.Item as UserDto) : null;
    }

    // ---------- PUT ----------
    async createUser(user: UserDto, passwordHash: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                alias: user.alias,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
                passwordHash,
            },
            ConditionExpression: "attribute_not_exists(alias)",
        };
        await this.client.send(new PutCommand(params));
    }

    // ---------- GET ----------
    async getPasswordHash(alias: string): Promise<string | null> {
        const res = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { alias },
                ProjectionExpression: "passwordHash",
            })
        );
        return res.Item?.passwordHash ?? null;
    }
}
