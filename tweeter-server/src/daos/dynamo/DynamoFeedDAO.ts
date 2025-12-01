import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    BatchWriteCommand,
    DeleteCommand,
    DynamoDBDocumentClient,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { StatusDto } from "tweeter-shared";
import { FeedDAO } from "../interfaces/FeedDAO";

export class DynamoFeedDAO implements FeedDAO {
    readonly tableName = "tweeterFeeds";
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    // ---------- BATCH PUT ----------
    public async batchPutFeedItems(
        userAlias: string,
        items: StatusDto[]
    ): Promise<void> {
        const chunks: StatusDto[][] = [];
        for (let i = 0; i < items.length; i += 25) {
            chunks.push(items.slice(i, i + 25));
        }
        for (const chunk of chunks) {
            await this.client.send(
                new BatchWriteCommand({
                    RequestItems: {
                        [this.tableName]: chunk.map((i) => ({
                            PutRequest: { Item: { ...i, userAlias } },
                        })),
                    },
                })
            );
        }
    }

    public async getPageOfFeedItems(
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        const params: any = {
            TableName: this.tableName,
            KeyConditionExpression: "userAlias = :u",
            ExpressionAttributeValues: { ":u": userAlias },
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey: lastItem
                ? { userAlias, timestamp: lastItem.timestamp }
                : undefined,
        };

        const data = await this.client.send(new QueryCommand(params));
        const items = data.Items?.map((i) => i as StatusDto) ?? [];
        const hasMore = data.LastEvaluatedKey !== undefined;
        return [items, hasMore];
    }

    // ---------- DELETE ----------
    public async deleteFeedItem(
        userAlias: string,
        statusId: string
    ): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: { userAlias, statusId },
        };
        await this.client.send(new DeleteCommand(params));
    }
}
