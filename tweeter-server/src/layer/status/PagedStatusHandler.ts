import {
    PagedStatusItemRequest,
    PagedStatusItemResponse,
    StatusDto,
} from "tweeter-shared";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { StatusService } from "../model/service/StatusService";

export const createPagedStatusHandler = (
    pagedMethod: (
        service: StatusService,
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ) => Promise<[StatusDto[], boolean]>
) => {
    return async (
        request: PagedStatusItemRequest
    ): Promise<PagedStatusItemResponse> => {
        const factory = new DynamoDAOFactory();
        const statusService = new StatusService(factory);
        const [items, hasMore] = await pagedMethod(
            statusService,
            request.token,
            request.userAlias,
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
};
