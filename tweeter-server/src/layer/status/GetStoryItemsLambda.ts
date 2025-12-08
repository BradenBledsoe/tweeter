import { createPagedStatusHandler } from "./PagedStatusHandler";

export const handler = createPagedStatusHandler(
    (service, token, userAlias, pageSize, lastItem) =>
        service.loadMoreStoryItems(token, userAlias, pageSize, lastItem)
);
