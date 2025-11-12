import { AuthorizationResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (
    request: LoginRequest
): Promise<AuthorizationResponse> => {
    const userService = new UserService();
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
