import { CombinedCountResponse, TweeterRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { AuthorizationService } from "../auth/AuthorizationService";

export const handler = async (
    request: TweeterRequest
): Promise<CombinedCountResponse> => {
    const factory = new DynamoDAOFactory();
    const auth = new AuthorizationService(factory.createAuthTokenDAO());
    const followService = new FollowService(factory, auth);
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
