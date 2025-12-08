import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    BatchWriteCommand,
    DynamoDBDocumentClient,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { StatusDto } from "tweeter-shared";
import { FeedDAO } from "../interfaces/FeedDAO";

export class DynamoFeedDAO implements FeedDAO {
    private client: DynamoDBDocumentClient;
    private tableName = "tweeterFeed";
    private ownerAttr = "feed_owner_alias";
    private timestampAttr = "timestamp";

    constructor() {
        this.client = DynamoDBDocumentClient.from(
            new DynamoDBClient({
                region: process.env.AWS_REGION || "us-east-1",
            })
        );
    }

    async addStatusToFeeds(
        status: StatusDto,
        followerAliases: string[]
    ): Promise<void> {
        if (!followerAliases || followerAliases.length === 0) return;

        const requests = followerAliases.map((alias) => ({
            PutRequest: {
                Item: {
                    [this.ownerAttr]: alias,
                    [this.timestampAttr]: status.timestamp,
                    post: status.post,
                    user: status.user,
                },
            },
        }));

        const chunkSize = 25;
        const sleep = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        for (let i = 0; i < requests.length; i += chunkSize) {
            let chunk = requests.slice(i, i + chunkSize);
            let attempts = 0;
            let toSend: any[] = chunk;
            while (toSend.length > 0 && attempts < 5) {
                attempts++;
                const params: any = {
                    RequestItems: { [this.tableName]: toSend },
                };
                try {
                    const res: any = await this.client.send(
                        new BatchWriteCommand(params)
                    );
                    const unprocessed =
                        res.UnprocessedItems?.[this.tableName] || [];
                    if (!unprocessed || unprocessed.length === 0) {
                        // finished this chunk
                        toSend = [];
                        break;
                    }
                    // retry unprocessed
                    toSend = unprocessed;
                    const backoff =
                        Math.pow(2, attempts) * 100 +
                        Math.floor(Math.random() * 100);
                    console.warn(
                        `BatchWrite to feed had ${toSend.length} unprocessed items; backing off ${backoff}ms (attempt ${attempts})`
                    );
                    await sleep(backoff);
                } catch (error) {
                    const backoff =
                        Math.pow(2, attempts) * 100 +
                        Math.floor(Math.random() * 100);
                    console.warn(
                        `BatchWrite to feed failed attempt ${attempts}; backing off ${backoff}ms`,
                        error
                    );
                    await sleep(backoff);
                }
            }

            if (toSend.length > 0) {
                throw new Error(
                    `Failed batch write to feed after retries; remaining ${toSend.length} items`
                );
            }
        }
    }

    async getFeed(
        feedOwnerAlias: string,
        lastTimestamp: number | null,
        limit: number
    ): Promise<[StatusDto[], boolean]> {
        const params: any = {
            TableName: this.tableName,
            KeyConditionExpression: `${this.ownerAttr} = :owner`,
            ExpressionAttributeValues: {
                ":owner": feedOwnerAlias,
            },
            ScanIndexForward: false,
            Limit: limit + 1,
        };

        if (lastTimestamp) {
            params.ExclusiveStartKey = {
                [this.ownerAttr]: feedOwnerAlias,
                [this.timestampAttr]: lastTimestamp,
            };
        }

        try {
            const result = await this.client.send(new QueryCommand(params));
            const items = result.Items || [];
            const statuses: StatusDto[] = items
                .slice(0, limit)
                .map((it: any) => {
                    return {
                        post: it.post,
                        user: it.user,
                        timestamp: it.timestamp,
                        segments: it.segments || [],
                    } as StatusDto;
                });
            const hasMore = items.length > limit;
            return [statuses, hasMore];
        } catch (error) {
            throw new Error(`Failed to get feed: ${error}`);
        }
    }
}
