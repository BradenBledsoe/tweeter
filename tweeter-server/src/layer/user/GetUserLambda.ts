import { GetUserResponse, TweeterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { AuthorizationService } from "../auth/AuthorizationService";

export const handler = async (
    request: TweeterRequest
): Promise<GetUserResponse> => {
    const factory = new DynamoDAOFactory();
    const auth = new AuthorizationService(factory.createAuthTokenDAO());
    const userService = new UserService(factory, auth);

    const user = await userService.getUser(request.token!, request.userAlias!);

    return {
        success: true,
        message: null,
        user: user,
    };
};
