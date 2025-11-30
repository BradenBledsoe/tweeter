import { AuthorizationResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { bootstrap } from "../ServiceBoostrap";

const userService = new UserService(bootstrap.factory, bootstrap.auth);

export const handler = async (
    request: RegisterRequest
): Promise<AuthorizationResponse> => {
    const [user, authToken] = await userService.register(
        request.firstName,
        request.lastName,
        request.userAlias!,
        request.password,
        request.userImageBytes,
        request.imageFileExtension
    );

    return {
        success: true,
        message: null,
        user: user,
        authToken: authToken,
    };
};
