// daos/dynamo/DynamoStatusDAO.ts
import { StatusDAO } from "../interfaces/StatusDAO";
import {
    DynamoDBClient,
    PutItemCommand,
    QueryCommand,
    BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { StatusDto } from "tweeter-shared";

export class DynamoStatusDAO implements StatusDAO {
    readonly tableName = "tweeterStories";
    readonly indexName = "author_index";
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    // ---------- PUT ----------
    public async putStatus(status: StatusDto): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: status,
            ConditionExpression: "attribute_not_exists(statusId)",
        };
        await this.client.send(new PutCommand(params));
    }

    // ---------- QUERY ----------
    public async getPageOfStatuses(
        authorAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        const params: any = {
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: "authorAlias = :a",
            ExpressionAttributeValues: { ":a": authorAlias },
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey: lastItem
                ? { authorAlias, timestamp: lastItem.timestamp }
                : undefined,
        };

        const data = await this.client.send(new QueryCommand(params));
        const items =
            (data.Items?.map((i) => unmarshall(i)) as StatusDto[]) ?? [];
        const hasMore = data.LastEvaluatedKey !== undefined;
        return [items, hasMore];
    }
}
