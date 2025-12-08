import { createPagedUserHandler } from "./PagedUserHandler";

export const handler = createPagedUserHandler(
    (service, token, userAlias, pageSize, lastItem) =>
        service.loadMoreFollowers(token, userAlias, pageSize, lastItem)
);
