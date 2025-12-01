import {
    DynamoDBDocumentClient,
    PutCommand,
    DeleteCommand,
    QueryCommand,
    QueryCommandInput,
    GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDto } from "tweeter-shared";
import { FollowDAO } from "../interfaces/FollowDAO";

export class DynamoFollowDAO implements FollowDAO {
    readonly tableName = "tweeterFollows";
    readonly indexName = "followee_index";
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    // ---------- FOLLOW ----------
    public async follow(follower: UserDto, followee: UserDto): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                follower_handle: follower.alias,
                followee_handle: followee.alias,
                follower_name: `${follower.firstName} ${follower.lastName}`,
                followee_name: `${followee.firstName} ${followee.lastName}`,
            },
            ConditionExpression:
                "attribute_not_exists(follower_handle) AND attribute_not_exists(followee_handle)",
        };
        await this.client.send(new PutCommand(params));
    }

    // ---------- UNFOLLOW ----------
    public async unfollow(
        followerAlias: string,
        followeeAlias: string
    ): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias,
            },
        };
        await this.client.send(new DeleteCommand(params));
    }

    // ---------- GET FOLLOWERS ----------
    public async getFollowers(
        followeeAlias: string,
        pageSize: number,
        lastFollowerAlias?: string
    ): Promise<[UserDto[], boolean]> {
        const params: any = {
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: "followee_handle = :f",
            ExpressionAttributeValues: { ":f": followeeAlias },
            Limit: pageSize,
            ExclusiveStartKey: lastFollowerAlias
                ? {
                      followee_handle: followeeAlias,
                      follower_handle: lastFollowerAlias,
                  }
                : undefined,
        };

        const data = await this.client.send(new QueryCommand(params));
        const users =
            data.Items?.map(
                (item) =>
                    ({
                        alias: item.follower_handle,
                        firstName: item.follower_name.split(" ")[0],
                        lastName: item.follower_name.split(" ")[1],
                        imageUrl: "", // optional if you store it
                    } as UserDto)
            ) ?? [];
        return [users, data.LastEvaluatedKey !== undefined];
    }

    // ---------- GET FOLLOWEES ----------
    public async getFollowees(
        followerAlias: string,
        pageSize: number,
        lastFolloweeAlias?: string
    ): Promise<[UserDto[], boolean]> {
        const params: any = {
            TableName: this.tableName,
            KeyConditionExpression: "follower_handle = :f",
            ExpressionAttributeValues: { ":f": followerAlias },
            Limit: pageSize,
            ExclusiveStartKey: lastFolloweeAlias
                ? {
                      follower_handle: followerAlias,
                      followee_handle: lastFolloweeAlias,
                  }
                : undefined,
        };

        const data = await this.client.send(new QueryCommand(params));
        const users =
            data.Items?.map(
                (item) =>
                    ({
                        alias: item.followee_handle,
                        firstName: item.followee_name.split(" ")[0],
                        lastName: item.followee_name.split(" ")[1],
                        imageUrl: "",
                    } as UserDto)
            ) ?? [];
        return [users, data.LastEvaluatedKey !== undefined];
    }

    // ---------- COUNTS ----------
    public async getFollowerCount(followeeAlias: string): Promise<number> {
        const params: QueryCommandInput = {
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: "followee_handle = :f",
            ExpressionAttributeValues: { ":f": followeeAlias },
            Select: "COUNT",
        };
        const data = await this.client.send(new QueryCommand(params));
        return data.Count ?? 0;
    }

    public async getFolloweeCount(followerAlias: string): Promise<number> {
        const params: QueryCommandInput = {
            TableName: this.tableName,
            KeyConditionExpression: "follower_handle = :f",
            ExpressionAttributeValues: { ":f": followerAlias },
            Select: "COUNT",
        };
        const data = await this.client.send(new QueryCommand(params));
        return data.Count ?? 0;
    }

    public async getFollow(
        followerAlias: string,
        followeeAlias: string
    ): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias,
            },
        };
        const res = await this.client.send(new GetCommand(params));
        return !!res.Item;
    }
}
