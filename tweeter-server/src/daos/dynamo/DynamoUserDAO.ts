import { UserDAO } from "../interfaces/UserDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDto } from "tweeter-shared";
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import * as bcrypt from "bcryptjs";

export class DynamoUserDAO implements UserDAO {
    private client: DynamoDBDocumentClient;
    private tableName = "tweeterUsers";
    private aliasAttr = "alias";

    constructor() {
        this.client = DynamoDBDocumentClient.from(
            new DynamoDBClient({
                region: process.env.AWS_REGION || "us-east-1",
            })
        );
    }

    async getByAlias(alias: string): Promise<UserDto | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.aliasAttr]: alias,
            },
        };
        try {
            const result = await this.client.send(new GetCommand(params));
            if (result.Item) {
                return {
                    alias: result.Item.alias,
                    firstName: result.Item.firstName,
                    lastName: result.Item.lastName,
                    imageUrl: result.Item.imageUrl,
                    hashedPassword: result.Item.hashedPassword,
                } as UserDto & { hashedPassword?: string };
            }
            return null;
        } catch (error) {
            throw new Error(`Failed to get user by alias: ${error}`);
        }
    }

    async validateCredentials(
        alias: string,
        password: string
    ): Promise<UserDto | null> {
        const user = await this.getByAlias(alias);
        const hashed = (user as any)?.hashedPassword;

        if (!user) {
            return null;
        }

        if (!hashed) {
            throw new Error(`Missing hashedPassword for user ${alias}`);
        }

        if (await bcrypt.compare(password, hashed)) {
            return user;
        }

        return null;
    }

    async create(user: UserDto, hashedPassword: string): Promise<void> {
        const existingUser = await this.getByAlias(user.alias);
        if (existingUser) {
            throw new Error(`User with alias ${user.alias} already exists`);
        }

        const params = {
            TableName: this.tableName,
            Item: {
                [this.aliasAttr]: user.alias,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
                hashedPassword: hashedPassword,
            },
        };
        try {
            await this.client.send(new PutCommand(params));
        } catch (error) {
            throw new Error(`Failed to create user: ${error}`);
        }
    }

    async adjustFollowerCountIfExists(
        alias: string,
        delta: number
    ): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.aliasAttr]: alias,
            },
            UpdateExpression: "SET follower_count = follower_count + :inc",
            ExpressionAttributeValues: {
                ":inc": delta,
            },
            ConditionExpression: "attribute_exists(follower_count)",
        } as any;

        try {
            await this.client.send(new UpdateCommand(params));
        } catch (error: any) {
            // If condition failed (attribute did not exist), just ignore — caller wanted
            // the change only if follower_count exists.
            const code = error?.name || error?.Code || "";
            if (code === "ConditionalCheckFailedException") {
                return;
            }
            // Otherwise rethrow
            throw new Error(
                `Failed to adjust follower_count for ${alias}: ${error}`
            );
        }
    }
}
