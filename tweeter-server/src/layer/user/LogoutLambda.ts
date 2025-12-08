import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";

export const handler = async (
    request: LogoutRequest
): Promise<LogoutResponse> => {
    const factory = new DynamoDAOFactory();
    const userService = new UserService(factory);

    try {
        await userService.logout(request.token);

        return {
            success: true,
            message: null,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Logout failed",
        };
    }
};
