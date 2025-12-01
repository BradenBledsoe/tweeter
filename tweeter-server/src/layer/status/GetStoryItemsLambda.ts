import {
    PagedStatusItemRequest,
    PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { AuthorizationService } from "../auth/AuthorizationService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";

export const handler = async (
    request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
    const factory = new DynamoDAOFactory();
    const auth = new AuthorizationService(factory.createAuthTokenDAO());
    const statusService = new StatusService(factory, auth);

    const [items, hasMore] = await statusService.loadMoreStoryItems(
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
