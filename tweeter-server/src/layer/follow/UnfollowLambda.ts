import { CombinedCountResponse, TweeterRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
    request: TweeterRequest
): Promise<CombinedCountResponse> => {
    const followService = new FollowService();
    const [followerCount, followeeCount] = await followService.unfollow(
        request.token,
        request.userAlias
    );

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount,
    };
};
