import { AuthorizationResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { AuthorizationService } from "../auth/AuthorizationService";

export const handler = async (
    request: RegisterRequest
): Promise<AuthorizationResponse> => {
    const factory = new DynamoDAOFactory();
    const auth = new AuthorizationService(factory.createAuthTokenDAO());
    const userService = new UserService(factory, auth);

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
