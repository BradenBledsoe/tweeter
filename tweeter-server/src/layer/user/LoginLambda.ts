import { AuthorizationResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { bootstrap } from "../ServiceBoostrap";

const userService = new UserService(bootstrap.factory, bootstrap.auth);

export const handler = async (
    request: LoginRequest
): Promise<AuthorizationResponse> => {
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
