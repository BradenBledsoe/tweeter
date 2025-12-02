import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthTokenDto } from "tweeter-shared";
import { AuthTokenRecord } from "../../layer/model/persistence/AuthTokenRecord";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
    readonly tableName = "tweeterAuthTokens";
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async putToken(token: AuthTokenRecord): Promise<void> {
        const params = { TableName: this.tableName, Item: token };
        await this.client.send(new PutCommand(params));
    }

    async getToken(token: string): Promise<AuthTokenRecord | null> {
        const params = { TableName: this.tableName, Key: { token } };
        const output = await this.client.send(new GetCommand(params));
        return output.Item ? (output.Item as AuthTokenRecord) : null;
    }

    async deleteToken(token: string): Promise<void> {
        const params = { TableName: this.tableName, Key: { token } };
        await this.client.send(new DeleteCommand(params));
    }
}
