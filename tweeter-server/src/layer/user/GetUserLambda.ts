import { GetUserResponse, TweeterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { bootstrap } from "../ServiceBoostrap";

const userService = new UserService(bootstrap.factory, bootstrap.auth);

export const handler = async (
    request: TweeterRequest
): Promise<GetUserResponse> => {
    const user = await userService.getUser(request.token!, request.userAlias!);

    return {
        success: true,
        message: null,
        user: user,
    };
};
