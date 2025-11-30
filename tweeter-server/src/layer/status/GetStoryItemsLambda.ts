import {
    PagedStatusItemRequest,
    PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { bootstrap } from "../ServiceBoostrap";

const statusService = new StatusService(bootstrap.factory, bootstrap.auth);

export const handler = async (
    request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
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
