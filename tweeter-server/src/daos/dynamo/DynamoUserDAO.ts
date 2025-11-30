// daos/dynamo/DynamoUserDAO.ts
import { UserDAO } from "../interfaces/UserDAO";
import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { UserDto } from "tweeter-shared";
import bcrypt from "bcryptjs";

export class DynamoUserDAO implements UserDAO {
    constructor(private ddb: DynamoDBClient, private tableName: string) {}

    async getUser(alias: string): Promise<UserDto | null> {
        const res = await this.ddb.send(
            new GetItemCommand({
                TableName: this.tableName,
                Key: marshall({ userAlias: alias }),
            })
        );
        return res.Item ? (unmarshall(res.Item) as UserDto) : null;
    }

    async createUser(
        user: UserDto,
        passwordHash: string,
        imageUrl?: string
    ): Promise<void> {
        await this.ddb.send(
            new PutItemCommand({
                TableName: this.tableName,
                Item: marshall(
                    {
                        ...user,
                        passwordHash,
                        imageUrl,
                    },
                    { removeUndefinedValues: true }
                ),
                ConditionExpression: "attribute_not_exists(userAlias)",
            })
        );
    }

    async updateProfileImage(alias: string, imageUrl: string): Promise<void> {
        await this.ddb.send(
            new UpdateItemCommand({
                TableName: this.tableName,
                Key: marshall({ userAlias: alias }),
                UpdateExpression: "SET imageUrl = :url",
                ExpressionAttributeValues: marshall({ ":url": imageUrl }),
            })
        );
    }

    async verifyPassword(alias: string, password: string): Promise<boolean> {
        const res = await this.ddb.send(
            new GetItemCommand({
                TableName: this.tableName,
                Key: marshall({ userAlias: alias }),
                ProjectionExpression: "passwordHash",
            })
        );
        if (!res.Item) return false;
        const hash = unmarshall(res.Item).passwordHash;
        return bcrypt.compare(password, hash);
    }
}
