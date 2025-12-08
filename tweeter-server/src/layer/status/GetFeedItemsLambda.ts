import { createPagedStatusHandler } from "./PagedStatusHandler";

export const handler = createPagedStatusHandler(
    (service, token, userAlias, pageSize, lastItem) =>
        service.loadMoreFeedItems(token, userAlias, pageSize, lastItem)
);
