import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";

const UPDATE_QUEUE_URL = process.env.UPDATE_FEED_QUEUE_URL || "";

export const handler = async (event: any): Promise<void> => {
    const factory = new DynamoDAOFactory();
    const followDao = factory.createFollowDAO();
    const sqs = new SQSClient({});

    // Make each message contain 100 followers so each UpdateFeeds invocation
    // will perform ~4 batch writes of 25 (100 total) which we can throttle.
    const CHUNK_SIZE = 100;

    for (const record of event.Records || []) {
        try {
            const status = JSON.parse(record.body);
            const posterAlias = status.user?.alias;
            if (!posterAlias) {
                console.warn(
                    "PostUpdateFeedMessagesLambda: message missing poster alias",
                    record.body
                );
                continue;
            }

            // get all follower aliases (direct DAO call; no auth required)
            const followers: string[] = await followDao.getAllFollowers(
                posterAlias
            );

            // Remove poster if present
            const recipients = followers.filter((a) => a !== posterAlias);

            // chunk recipients and prepare a list of chunk messages to send
            const chunkMessages: { id: string; body: string }[] = [];
            let chunkIndex = 0;
            for (let i = 0; i < recipients.length; i += CHUNK_SIZE) {
                const chunk = recipients.slice(i, i + CHUNK_SIZE);
                const body = JSON.stringify({ status, followerAliases: chunk });
                chunkMessages.push({
                    id: `${Date.now()}-${chunkIndex++}`,
                    body,
                });
            }

            // Send messages in batches of up to 10 entries using SendMessageBatch
            const BATCH_SEND_SIZE = 10;
            const MAX_SEND_ATTEMPTS = 3;

            const sleep = (ms: number) =>
                new Promise((resolve) => setTimeout(resolve, ms));

            const sendBatchWithRetry = async (
                entries: { id: string; body: string }[]
            ) => {
                let attempts = 0;
                let toSend = entries.map((e) => ({
                    Id: e.id,
                    MessageBody: e.body,
                }));

                while (toSend.length > 0 && attempts < MAX_SEND_ATTEMPTS) {
                    attempts++;
                    try {
                        const cmd = new SendMessageBatchCommand({
                            QueueUrl: UPDATE_QUEUE_URL,
                            Entries: toSend,
                        });
                        const res = await sqs.send(cmd);
                        const failed = (res.Failed || []).map((f) => f.Id);
                        if (failed.length === 0) {
                            // all good
                            return;
                        }
                        // prepare to retry only the failed entries
                        toSend = toSend.filter((e) => failed.includes(e.Id));
                        const backoff =
                            Math.pow(2, attempts) * 100 +
                            Math.floor(Math.random() * 100);
                        console.warn(
                            `SendMessageBatch attempt ${attempts} had ${failed.length} failed entries; backing off ${backoff}ms`
                        );
                        await sleep(backoff);
                    } catch (err) {
                        const backoff =
                            Math.pow(2, attempts) * 100 +
                            Math.floor(Math.random() * 100);
                        console.warn(
                            `SendMessageBatch failed attempt ${attempts}, backing off ${backoff}ms`,
                            err
                        );
                        await sleep(backoff);
                    }
                }

                if (toSend.length > 0) {
                    throw new Error(
                        `Failed to enqueue ${toSend.length} messages to UpdateFeedQueue after ${MAX_SEND_ATTEMPTS} attempts`
                    );
                }
            };

            for (let i = 0; i < chunkMessages.length; i += BATCH_SEND_SIZE) {
                const batch = chunkMessages.slice(i, i + BATCH_SEND_SIZE);
                await sendBatchWithRetry(batch);
            }
        } catch (err) {
            console.error(
                "PostUpdateFeedMessagesLambda: failed to process record",
                err,
                record
            );
            // Let Lambda/SQS retry based on visibility timeout
            throw err;
        }
    }
};
