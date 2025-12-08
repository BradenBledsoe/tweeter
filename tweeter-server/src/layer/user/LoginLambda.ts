import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";

export const handler = async (request: LoginRequest): Promise<AuthResponse> => {
    const factory = new DynamoDAOFactory();
    const userService = new UserService(factory);
    try {
        const [user, authToken] = await userService.login(
            request.alias,
            request.password
        );

        return {
            success: true,
            message: null,
            user: user,
            token: authToken,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Login failed",
            token: undefined as any,
            user: undefined as any,
        };
    }
};
