import { StatusDAO } from "../interfaces/StatusDAO";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { StatusDto } from "tweeter-shared";
import { StatusItem } from "../../layer/model/persistence/StatusItem";

export class DynamoStatusDAO implements StatusDAO {
    readonly tableName = "tweeterStories";
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    // ---------- PUT ----------
    public async putStatus(status: StatusItem): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: status,
        };
        await this.client.send(new PutCommand(params));
    }

    // ---------- QUERY ----------
    public async getPageOfStatuses(
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        console.log("HIT Getting page of statuses for userAlias:", userAlias);
        console.log("lastItem:", lastItem);
        const params: any = {
            TableName: this.tableName,
            KeyConditionExpression: "userAlias = :a",
            ExpressionAttributeValues: { ":a": userAlias },
            Limit: pageSize,
            ScanIndexForward: false,
        };
        if (lastItem) {
            params.ExclusiveStartKey = {
                userAlias,
                timestamp: Number(lastItem.timestamp),
            };
        }
        console.log("Query params:", JSON.stringify(params, null, 2));

        const data = await this.client.send(new QueryCommand(params));
        const items =
            (data.Items?.map((i) => unmarshall(i)) as StatusDto[]) ?? [];
        const hasMore = data.LastEvaluatedKey !== undefined;
        return [items, hasMore];
    }
}
