import {
    PagedStatusItemRequest,
    PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { AuthorizationService } from "../auth/AuthorizationService";

export const handler = async (
    request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
    const factory = new DynamoDAOFactory();
    const auth = new AuthorizationService(factory.createAuthTokenDAO());
    const statusService = new StatusService(factory, auth);

    try {
        const [items, hasMore] = await statusService.loadMoreFeedItems(
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
