import { AuthorizationResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { AuthorizationService } from "../auth/AuthorizationService";

export const handler = async (
    request: LoginRequest
): Promise<AuthorizationResponse> => {
    const factory = new DynamoDAOFactory();
    const auth = new AuthorizationService(factory.createAuthTokenDAO());
    const userService = new UserService(factory, auth);

    const [user, authToken] = await userService.login(
        request.userAlias!,
        request.password
    );

    return {
        success: true,
        message: null,
        user: user,
        authToken: authToken,
    };
};
