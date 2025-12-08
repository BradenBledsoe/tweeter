import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";

export const handler = async (event: any): Promise<void> => {
    const factory = new DynamoDAOFactory();
    const feedDao = factory.createFeedDAO();

    // Process each SQS record. To avoid overwhelming the feed table, enforce
    // a per-record minimum processing time (throttling). The producer should
    // be sending ~100 followers per message so each invocation will perform
    // ~4 DynamoDB batch writes. Ensure each record processing takes at least
    // 1 second (adjustable) so reserved concurrency + WCU remain under control.
    const MIN_PROCESS_MS = 1000;

    for (const record of event.Records || []) {
        const start = Date.now();
        try {
            const body = JSON.parse(record.body);
            const status = body.status;
            const followerAliases: string[] = body.followerAliases || [];

            if (
                !status ||
                !Array.isArray(followerAliases) ||
                followerAliases.length === 0
            ) {
                console.warn(
                    "UpdateFeedsLambda: skipping invalid message",
                    record.body
                );
            } else {
                await feedDao.addStatusToFeeds(status, followerAliases);
            }
        } catch (err) {
            console.error(
                "UpdateFeedsLambda: failed to process record",
                err,
                record
            );
            // Throw so the message can be retried by Lambda/SQS
            throw err;
        } finally {
            const elapsed = Date.now() - start;
            if (elapsed < MIN_PROCESS_MS) {
                await new Promise((resolve) =>
                    setTimeout(resolve, MIN_PROCESS_MS - elapsed)
                );
            }
        }
    }
};
