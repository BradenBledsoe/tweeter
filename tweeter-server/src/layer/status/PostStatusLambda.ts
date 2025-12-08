import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { StatusService } from "../model/service/StatusService";

const POST_UPDATE_QUEUE_URL = process.env.POST_UPDATE_FEED_QUEUE_URL || "";

export const handler = async (
    request: PostStatusRequest
): Promise<PostStatusResponse> => {
    const factory = new DynamoDAOFactory();
    const statusService = new StatusService(factory);

    // create the status in the story table
    const savedStatus = await statusService.postStatus(
        request.token,
        request.newStatus
    );

    // enqueue a message for the PostUpdateFeedMessages queue to fan-out to followers asynchronously
    const sqs = new SQSClient({});
    const cmd = new SendMessageCommand({
        QueueUrl: POST_UPDATE_QUEUE_URL,
        MessageBody: JSON.stringify(savedStatus),
    });
    await sqs.send(cmd);

    return {
        success: true,
        message: null,
    };
};
