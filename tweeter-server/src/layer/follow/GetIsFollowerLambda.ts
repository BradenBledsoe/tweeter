import {
    IsFollowerStatusRequest,
    IsFollowerStatusResponse,
} from "tweeter-shared";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
    request: IsFollowerStatusRequest
): Promise<IsFollowerStatusResponse> => {
    const factory = new DynamoDAOFactory();
    const followService = new FollowService(factory);
    const isFollower = await followService.getIsFollowerStatus(
        request.token,
        request.user,
        request.selectedUser
    );

    return {
        success: true,
        message: null,
        isFollower: isFollower,
    };
};
