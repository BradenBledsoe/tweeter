import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { bootstrap } from "../ServiceBoostrap";

const userService = new UserService(bootstrap.factory, bootstrap.auth);

export const handler = async (
    request: TweeterRequest
): Promise<TweeterResponse> => {
    await userService.logout(request.token!);

    return {
        success: true,
        message: null,
    };
};
