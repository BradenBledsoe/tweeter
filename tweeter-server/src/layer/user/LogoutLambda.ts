import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { AuthorizationService } from "../auth/AuthorizationService";
import { extractToken } from "../auth/TokenExtractor";

export const handler = async (
    request: TweeterRequest
): Promise<TweeterResponse> => {
    const factory = new DynamoDAOFactory();
    const auth = new AuthorizationService(factory.createAuthTokenDAO());
    const userService = new UserService(factory, auth);
    console.log("LogoutLambda invoked with request:", request);

    try {
        const token = extractToken(request);
        await userService.logout(token);

        return {
            success: true,
            message: null,
        };
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};
