import { UserItemCountResponse, TweeterRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { AuthorizationService } from "../auth/AuthorizationService";

export const handler = async (
    request: TweeterRequest
): Promise<UserItemCountResponse> => {
    const factory = new DynamoDAOFactory();
    const auth = new AuthorizationService(factory.createAuthTokenDAO());
    const followService = new FollowService(factory, auth);

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
