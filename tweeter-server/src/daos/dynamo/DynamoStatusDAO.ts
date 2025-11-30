// daos/dynamo/DynamoStatusDAO.ts
import { StatusDAO } from "../interfaces/StatusDAO";
import {
    DynamoDBClient,
    PutItemCommand,
    QueryCommand,
    BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { StatusDto } from "tweeter-shared";

export class DynamoStatusDAO implements StatusDAO {
    constructor(
        private ddb: DynamoDBClient,
        private storyTable: string,
        private feedTable: string,
        private followersTable: string
    ) {}

    async putStatus(userAlias: string, status: StatusDto): Promise<void> {
        await this.ddb.send(
            new PutItemCommand({
                TableName: this.storyTable,
                Item: marshall({ userAlias, ...status }),
            })
        );
    }

    async listStory(
        userAlias: string,
        pageSize: number,
        lastKey?: string
    ): Promise<[StatusDto[], boolean]> {
        const res = await this.ddb.send(
            new QueryCommand({
                TableName: this.storyTable,
                KeyConditionExpression: "userAlias = :u",
                ExpressionAttributeValues: marshall({ ":u": userAlias }),
                Limit: pageSize,
                ScanIndexForward: false,
                ...(lastKey
                    ? { ExclusiveStartKey: marshall(JSON.parse(lastKey)) }
                    : {}),
            })
        );
        const items = (res.Items ?? []).map((i) => unmarshall(i) as StatusDto);
        return [items, !!res.LastEvaluatedKey];
    }

    async listFeed(
        userAlias: string,
        pageSize: number,
        lastKey?: string
    ): Promise<[StatusDto[], boolean]> {
        const res = await this.ddb.send(
            new QueryCommand({
                TableName: this.feedTable,
                KeyConditionExpression: "userAlias = :u",
                ExpressionAttributeValues: marshall({ ":u": userAlias }),
                Limit: pageSize,
                ScanIndexForward: false,
                ...(lastKey
                    ? { ExclusiveStartKey: marshall(JSON.parse(lastKey)) }
                    : {}),
            })
        );
        const items = (res.Items ?? []).map((i) => unmarshall(i) as StatusDto);
        return [items, !!res.LastEvaluatedKey];
    }

    async fanOutStatus(authorAlias: string, status: StatusDto): Promise<void> {
        // Query followers
        const followersRes = await this.ddb.send(
            new QueryCommand({
                TableName: this.followersTable,
                KeyConditionExpression: "followeeAlias = :f",
                ExpressionAttributeValues: marshall({ ":f": authorAlias }),
            })
        );
        const followers = (followersRes.Items ?? []).map(
            (i) => unmarshall(i).followerAlias
        );

        // Batch write into each follower's feed
        for (const follower of followers) {
            const reqItems = [
                {
                    PutRequest: {
                        Item: marshall({ userAlias: follower, ...status }),
                    },
                },
            ];
            await this.ddb.send(
                new BatchWriteItemCommand({
                    RequestItems: { [this.feedTable]: reqItems },
                })
            );
        }
    }
}
