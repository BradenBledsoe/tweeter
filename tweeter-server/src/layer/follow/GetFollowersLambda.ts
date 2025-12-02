import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { AuthorizationService } from "../auth/AuthorizationService";

export const handler = async (
    request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
    const factory = new DynamoDAOFactory();
    const auth = new AuthorizationService(factory.createAuthTokenDAO());
    const followService = new FollowService(factory, auth);

    try {
        const [items, hasMore] = await followService.loadMoreFollowers(
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
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};
