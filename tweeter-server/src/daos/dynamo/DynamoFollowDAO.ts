// daos/dynamo/DynamoFollowDAO.ts
import { FollowDAO } from "../interfaces/FollowDAO";
import {
    DynamoDBClient,
    PutItemCommand,
    DeleteItemCommand,
    QueryCommand,
    GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { UserDto } from "tweeter-shared";

export class DynamoFollowDAO implements FollowDAO {
    constructor(
        private ddb: DynamoDBClient,
        private tableName: string,
        private followeesIndexName: string
    ) {}

    async follow(followerAlias: string, followeeAlias: string): Promise<void> {
        await this.ddb.send(
            new PutItemCommand({
                TableName: this.tableName,
                Item: marshall({ followeeAlias, followerAlias }),
            })
        );
    }

    async unfollow(
        followerAlias: string,
        followeeAlias: string
    ): Promise<void> {
        await this.ddb.send(
            new DeleteItemCommand({
                TableName: this.tableName,
                Key: marshall({ followeeAlias, followerAlias }),
            })
        );
    }

    async listFollowers(
        followeeAlias: string,
        pageSize: number,
        lastKey?: string
    ): Promise<[UserDto[], boolean]> {
        const res = await this.ddb.send(
            new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: "followeeAlias = :f",
                ExpressionAttributeValues: marshall({ ":f": followeeAlias }),
                Limit: pageSize,
                ...(lastKey
                    ? { ExclusiveStartKey: marshall(JSON.parse(lastKey)) }
                    : {}),
            })
        );
        const items = (res.Items ?? []).map(
            (i) => ({ alias: unmarshall(i).followerAlias } as UserDto)
        );
        return [items, !!res.LastEvaluatedKey];
    }

    async listFollowees(
        followerAlias: string,
        pageSize: number,
        lastKey?: string
    ): Promise<[UserDto[], boolean]> {
        const res = await this.ddb.send(
            new QueryCommand({
                TableName: this.tableName,
                IndexName: this.followeesIndexName, // GSI on followerAlias
                KeyConditionExpression: "followerAlias = :f",
                ExpressionAttributeValues: marshall({ ":f": followerAlias }),
                Limit: pageSize,
                ...(lastKey
                    ? { ExclusiveStartKey: marshall(JSON.parse(lastKey)) }
                    : {}),
            })
        );
        const items = (res.Items ?? []).map(
            (i) => ({ alias: unmarshall(i).followeeAlias } as UserDto)
        );
        return [items, !!res.LastEvaluatedKey];
    }

    async getFollowerCount(alias: string): Promise<number> {
        const res = await this.ddb.send(
            new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: "followeeAlias = :f",
                ExpressionAttributeValues: marshall({ ":f": alias }),
                Select: "COUNT",
            })
        );
        return res.Count ?? 0;
    }

    async getFolloweeCount(alias: string): Promise<number> {
        const res = await this.ddb.send(
            new QueryCommand({
                TableName: this.tableName,
                IndexName: this.followeesIndexName,
                KeyConditionExpression: "followerAlias = :f",
                ExpressionAttributeValues: marshall({ ":f": alias }),
                Select: "COUNT",
            })
        );
        return res.Count ?? 0;
    }

    async isFollower(
        followerAlias: string,
        followeeAlias: string
    ): Promise<boolean> {
        const res = await this.ddb.send(
            new GetItemCommand({
                TableName: this.tableName,
                Key: marshall({ followeeAlias, followerAlias }),
            })
        );
        return !!res.Item;
    }
}
