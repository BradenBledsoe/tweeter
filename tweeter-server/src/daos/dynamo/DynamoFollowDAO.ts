import {
    DynamoDBDocumentClient,
    PutCommand,
    DeleteCommand,
    QueryCommand,
    GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, Select } from "@aws-sdk/client-dynamodb";
import { UserDto } from "tweeter-shared";
import { FollowDAO } from "../interfaces/FollowDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";

export class DynamoFollowDAO implements FollowDAO {
    private client: DynamoDBDocumentClient;
    private tableName = "tweeterFollows";
    private indexName = "followee-follower-index";
    private followerAliasAttr = "follower_alias";
    private followeeAliasAttr = "followee_alias";
    private userDAO: DynamoUserDAO;

    constructor() {
        this.client = DynamoDBDocumentClient.from(
            new DynamoDBClient({
                region: process.env.AWS_REGION || "us-east-1",
            })
        );
        this.userDAO = new DynamoUserDAO();
    }

    async follow(followerAlias: string, followeeAlias: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followerAliasAttr]: followerAlias,
                [this.followeeAliasAttr]: followeeAlias,
            },
        };

        try {
            await this.client.send(new PutCommand(params));
        } catch (error) {
            throw new Error(`Failed to create follow relationship: ${error}`);
        }

        // If the user item contains a denormalized follower_count attribute, increment it.
        try {
            await this.userDAO.adjustFollowerCountIfExists(followeeAlias, 1);
        } catch (err) {
            // Don't fail the follow operation if the increment step fails; log and continue.
            console.warn(
                `Failed to increment follower_count for ${followeeAlias}: ${err}`
            );
        }
    }

    async unfollow(
        followerAlias: string,
        followeeAlias: string
    ): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.followerAliasAttr]: followerAlias,
                [this.followeeAliasAttr]: followeeAlias,
            },
        };

        try {
            await this.client.send(new DeleteCommand(params));
        } catch (error) {
            throw new Error(`Failed to remove follow relationship: ${error}`);
        }

        // If the user item contains a denormalized follower_count attribute, decrement it.
        try {
            await this.userDAO.adjustFollowerCountIfExists(followeeAlias, -1);
        } catch (err) {
            console.warn(
                `Failed to decrement follower_count for ${followeeAlias}: ${err}`
            );
        }
    }

    async isFollowing(
        followerAlias: string,
        followeeAlias: string
    ): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.followerAliasAttr]: followerAlias,
                [this.followeeAliasAttr]: followeeAlias,
            },
        };

        try {
            const result = await this.client.send(new GetCommand(params));
            return !!result.Item;
        } catch (error) {
            throw new Error(`Failed to check follow relationship: ${error}`);
        }
    }

    async getFollowees(
        followerAlias: string,
        lastFolloweeAlias: string | null,
        limit: number
    ): Promise<[UserDto[], boolean]> {
        const params: any = {
            TableName: this.tableName,
            KeyConditionExpression: this.followerAliasAttr + " = :follower",
            ExpressionAttributeValues: {
                ":follower": followerAlias,
            },
            Limit: limit + 1, // Get one extra to check if there are more
        };

        if (lastFolloweeAlias) {
            params.ExclusiveStartKey = {
                [this.followerAliasAttr]: followerAlias,
                [this.followeeAliasAttr]: lastFolloweeAlias,
            };
        }

        try {
            const result = await this.client.send(new QueryCommand(params));
            const items = result.Items || [];

            // Get user details for each followee
            const followeeAliases = items.slice(0, limit).map((item: any) => {
                return item[this.followeeAliasAttr];
            });

            const followees: UserDto[] = [];
            for (const alias of followeeAliases) {
                const user = await this.userDAO.getByAlias(alias);
                if (user) {
                    followees.push(user);
                }
            }

            const hasMore = items.length > limit;
            return [followees, hasMore];
        } catch (error) {
            throw new Error(`Failed to get followees: ${error}`);
        }
    }

    async getFollowers(
        followeeAlias: string,
        lastFollowerAlias: string | null,
        limit: number
    ): Promise<[UserDto[], boolean]> {
        const params: any = {
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: this.followeeAliasAttr + " = :followee",
            ExpressionAttributeValues: {
                ":followee": followeeAlias,
            },
            Limit: limit + 1, // Get one extra to check if there are more
        };

        if (lastFollowerAlias) {
            params.ExclusiveStartKey = {
                [this.followeeAliasAttr]: followeeAlias,
                [this.followerAliasAttr]: lastFollowerAlias,
            };
        }

        try {
            const result = await this.client.send(new QueryCommand(params));
            const items = result.Items || [];

            // Get user details for each follower
            const followerAliases = items.slice(0, limit).map((item: any) => {
                return item[this.followerAliasAttr];
            });

            const followers: UserDto[] = [];
            for (const alias of followerAliases) {
                const user = await this.userDAO.getByAlias(alias);
                if (user) {
                    followers.push(user);
                }
            }

            const hasMore = items.length > limit;
            return [followers, hasMore];
        } catch (error) {
            throw new Error(`Failed to get followers: ${error}`);
        }
    }

    async getFolloweeCount(followerAlias: string): Promise<number> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: this.followerAliasAttr + " = :follower",
            ExpressionAttributeValues: {
                ":follower": followerAlias,
            },
            Select: Select.COUNT,
        };

        try {
            const result = await this.client.send(new QueryCommand(params));
            return result.Count || 0;
        } catch (error) {
            throw new Error(`Failed to get followee count: ${error}`);
        }
    }

    async getFollowerCount(followeeAlias: string): Promise<number> {
        const params = {
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: this.followeeAliasAttr + " = :followee",
            ExpressionAttributeValues: {
                ":followee": followeeAlias,
            },
            Select: Select.COUNT,
        };

        try {
            const result = await this.client.send(new QueryCommand(params));
            return result.Count || 0;
        } catch (error) {
            throw new Error(`Failed to get follower count: ${error}`);
        }
    }

    async getAllFollowers(followeeAlias: string): Promise<string[]> {
        const params: any = {
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: this.followeeAliasAttr + " = :followee",
            ExpressionAttributeValues: {
                ":followee": followeeAlias,
            },
        };

        try {
            const followers: string[] = [];
            let lastEvaluatedKey: any = undefined;

            do {
                if (lastEvaluatedKey) {
                    params.ExclusiveStartKey = lastEvaluatedKey;
                }

                const result = await this.client.send(new QueryCommand(params));
                const items = result.Items || [];

                for (const item of items) {
                    followers.push(item[this.followerAliasAttr]);
                }

                lastEvaluatedKey = result.LastEvaluatedKey;
            } while (lastEvaluatedKey);

            return followers;
        } catch (error) {
            throw new Error(`Failed to get all followers: ${error}`);
        }
    }
}
