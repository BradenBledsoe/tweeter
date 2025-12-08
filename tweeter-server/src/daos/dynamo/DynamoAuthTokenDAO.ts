import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
    readonly tableName = "tweeterAuthTokens";
    private client: DynamoDBDocumentClient;

    constructor() {
        this.client = DynamoDBDocumentClient.from(
            new DynamoDBClient({
                region: process.env.AWS_REGION || "us-east-1",
            })
        );
    }
    async create(
        token: string,
        userAlias: string,
        timestamp: number
    ): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                token: token,
                userAlias: userAlias,
                timestamp: timestamp,
            },
        };

        try {
            await this.client.send(new PutCommand(params));
        } catch (error) {
            throw new Error(`Failed to create auth token: ${error}`);
        }
    }

    async validate(token: string): Promise<string | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                token: token,
            },
        };

        try {
            const result = await this.client.send(new GetCommand(params));
            if (result.Item) {
                const storedTs = (result.Item as any).timestamp;
                const nowMs = Date.now();
                const ttlSeconds = parseInt(
                    process.env.AUTH_TOKEN_TTL_SECONDS || "1800"
                );
                const ttlMs = ttlSeconds * 1000;
                if (typeof storedTs === "number") {
                    if (nowMs - storedTs >= ttlMs) {
                        try {
                            await this.delete(token);
                        } catch (_) {}
                        return null;
                    }
                }
                try {
                    await this.refresh(token, nowMs);
                } catch (err) {
                    throw new Error(`Failed to refresh auth token: ${err}`);
                }
                return result.Item.userAlias;
            }
        } catch (error) {
            throw new Error(`Failed to validate auth token: ${error}`);
        }
        return null;
    }

    async delete(token: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                token: token,
            },
        };

        try {
            await this.client.send(new DeleteCommand(params));
        } catch (error) {
            throw new Error(`Failed to delete auth token: ${error}`);
        }
    }

    async refresh(token: string, newTimestamp: number): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                token: token,
            },
        };

        try {
            const result = await this.client.send(new GetCommand(params));
            if (result.Item) {
                const updateParams = {
                    TableName: this.tableName,
                    Key: {
                        token: token,
                    },
                    UpdateExpression: "SET #ts = :newTimestamp",
                    ExpressionAttributeNames: {
                        "#ts": "timestamp",
                    },
                    ExpressionAttributeValues: {
                        ":newTimestamp": newTimestamp,
                    },
                };
                await this.client.send(new UpdateCommand(updateParams));
            }
        } catch (error) {
            throw new Error(`Failed to refresh auth token: ${error}`);
        }
    }
}
