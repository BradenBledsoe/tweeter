import {
    PagedUserItemRequest,
    PagedUserItemResponse,
    UserDto,
} from "tweeter-shared";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { FollowService } from "../model/service/FollowService";

export const createPagedUserHandler = (
    pagedMethod: (
        service: FollowService,
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ) => Promise<[UserDto[], boolean]>
) => {
    return async (
        request: PagedUserItemRequest
    ): Promise<PagedUserItemResponse> => {
        const factory = new DynamoDAOFactory();
        const followService = new FollowService(factory);
        const [items, hasMore] = await pagedMethod(
            followService,
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
