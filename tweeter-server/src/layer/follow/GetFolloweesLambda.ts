import { createPagedUserHandler } from "./PagedUserHandler";

export const handler = createPagedUserHandler(
    (service, token, userAlias, pageSize, lastItem) =>
        service.loadMoreFollowees(token, userAlias, pageSize, lastItem)
);
