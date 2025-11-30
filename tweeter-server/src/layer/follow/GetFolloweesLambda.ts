import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { bootstrap } from "../ServiceBoostrap";

const followService = new FollowService(bootstrap.factory, bootstrap.auth);

export const handler = async (
    request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
    const [items, hasMore] = await followService.loadMoreFollowees(
        request.token!,
        request.userAlias!,
        request.pageSize,
        request.lastItem
    );

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore,
    };
};
