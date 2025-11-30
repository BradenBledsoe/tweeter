import { UserItemCountResponse, TweeterRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { bootstrap } from "../ServiceBoostrap";

const followService = new FollowService(bootstrap.factory, bootstrap.auth);

export const handler = async (
    request: TweeterRequest
): Promise<UserItemCountResponse> => {
    const count = await followService.getFollowerCount(
        request.token!,
        request.userAlias!
    );

    return {
        success: true,
        message: null,
        count: count,
    };
};
