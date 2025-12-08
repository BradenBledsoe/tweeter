import {
    FollowActionRequest,
    GetItemCountResponse,
    UserDto,
} from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";

export const createCountHandler = (
    countMethod: (
        service: FollowService,
        token: string,
        user: UserDto
    ) => Promise<number>
) => {
    return async (
        request: FollowActionRequest
    ): Promise<GetItemCountResponse> => {
        const factory = new DynamoDAOFactory();
        const followService = new FollowService(factory);
        const count = await countMethod(
            followService,
            request.token,
            request.user
        );

        return {
            success: true,
            message: null,
            count: count,
        };
    };
};
