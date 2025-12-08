import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StatusDAO } from "../interfaces/StatusDAO";
import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { StatusDto } from "tweeter-shared";

export class DynamoStatusDAO implements StatusDAO {
    private client: DynamoDBDocumentClient;
    private tableName = "tweeterStatuses";
    private authorAttr = "author_alias";
    private timestampAttr = "timestamp";

    constructor() {
        this.client = DynamoDBDocumentClient.from(
            new DynamoDBClient({
                region: process.env.AWS_REGION || "us-east-1",
            })
        );
    }

    async create(status: StatusDto): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.authorAttr]: status.user.alias,
                [this.timestampAttr]: status.timestamp,
                post: status.post,
                user: status.user,
            },
        };

        try {
            await this.client.send(new PutCommand(params));
        } catch (error) {
            throw new Error(`Failed to create status: ${error}`);
        }
    }

    async getUserStory(
        authorAlias: string,
        lastTimestamp: number | null,
        limit: number
    ): Promise<[StatusDto[], boolean]> {
        const params: any = {
            TableName: this.tableName,
            KeyConditionExpression: `${this.authorAttr} = :author`,
            ExpressionAttributeValues: {
                ":author": authorAlias,
            },
            ScanIndexForward: false,
            Limit: limit + 1,
        };

        if (lastTimestamp) {
            params.ExclusiveStartKey = {
                [this.authorAttr]: authorAlias,
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
            throw new Error(`Failed to get user story: ${error}`);
        }
    }
}
