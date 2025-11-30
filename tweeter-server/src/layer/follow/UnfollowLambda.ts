import { CombinedCountResponse, TweeterRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { bootstrap } from "../ServiceBoostrap";

const followService = new FollowService(bootstrap.factory, bootstrap.auth);

export const handler = async (
    request: TweeterRequest
): Promise<CombinedCountResponse> => {
    const [followerCount, followeeCount] = await followService.unfollow(
        request.token!,
        request.userAlias!
    );

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount,
    };
};
