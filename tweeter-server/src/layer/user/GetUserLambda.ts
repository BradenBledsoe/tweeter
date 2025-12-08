import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";

export const handler = async (
    request: GetUserRequest
): Promise<GetUserResponse> => {
    const factory = new DynamoDAOFactory();
    const userService = new UserService(factory);

    try {
        const userDto = await userService.getUser(
            request.token,
            request.userAlias
        );

        return {
            success: true,
            message: null,
            user: userDto,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Get user failed",
            user: undefined as any,
        };
    }
};
