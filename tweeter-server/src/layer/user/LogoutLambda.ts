import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { AuthorizationService } from "../auth/AuthorizationService";

export const handler = async (
    request: TweeterRequest
): Promise<TweeterResponse> => {
    const factory = new DynamoDAOFactory();
    const auth = new AuthorizationService(factory.createAuthTokenDAO());
    const userService = new UserService(factory, auth);

    try {
        await userService.logout(request.token!);

        return {
            success: true,
            message: null,
        };
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};
