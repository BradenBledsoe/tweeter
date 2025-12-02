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

    try {
        const count = await followService.getFolloweeCount(
            request.token!,
            request.userAlias!
        );

        return {
            success: true,
            message: null,
            count: count,
        };
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};
