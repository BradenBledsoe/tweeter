// daos/dynamo/DynamoAuthTokenDAO.ts
import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import {
    DynamoDBClient,
    PutItemCommand,
    GetItemCommand,
    DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AuthTokenDto } from "tweeter-shared";

export class DynamoAuthTokenDAO implements AuthTokenDAO {
    constructor(private ddb: DynamoDBClient, private tableName: string) {}

    async putToken(token: AuthTokenDto): Promise<void> {
        await this.ddb.send(
            new PutItemCommand({
                TableName: this.tableName,
                Item: marshall(token),
            })
        );
    }

    async getToken(token: string): Promise<AuthTokenDto | null> {
        const res = await this.ddb.send(
            new GetItemCommand({
                TableName: this.tableName,
                Key: marshall({ token }),
            })
        );
        return res.Item ? (unmarshall(res.Item) as AuthTokenDto) : null;
    }

    async deleteToken(token: string): Promise<void> {
        await this.ddb.send(
            new DeleteItemCommand({
                TableName: this.tableName,
                Key: marshall({ token }),
            })
        );
    }
}
