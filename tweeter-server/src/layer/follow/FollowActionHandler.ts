import {
    FollowActionRequest,
    FollowActionResponse,
    UserDto,
} from "tweeter-shared";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { FollowService } from "../model/service/FollowService";

export const createFollowActionHandler = (
    action: (
        service: FollowService,
        token: string,
        user: UserDto
    ) => Promise<[number, number]>
) => {
    return async (
        request: FollowActionRequest
    ): Promise<FollowActionResponse> => {
        const factory = new DynamoDAOFactory();
        const followService = new FollowService(factory);
        const [followerCount, followeeCount] = await action(
            followService,
            request.token,
            request.user
        );

        return {
            success: true,
            message: null,
            followerCount: followerCount,
            followeeCount: followeeCount,
        };
    };
};
