import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";

export const handler = async (
    request: RegisterRequest
): Promise<AuthResponse> => {
    const factory = new DynamoDAOFactory();
    const userService = new UserService(factory);
    try {
        const [user, authToken] = await userService.register(
            request.firstName,
            request.lastName,
            request.alias,
            request.password,
            request.imageStringBase64,
            request.imageFileExtension
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
            message: error?.message || "Registration failed",
            token: undefined as any,
            user: undefined as any,
        };
    }
};
