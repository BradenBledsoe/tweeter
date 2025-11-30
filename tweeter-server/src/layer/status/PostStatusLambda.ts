import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { bootstrap } from "../ServiceBoostrap";

const statusService = new StatusService(bootstrap.factory, bootstrap.auth);

export const handler = async (
    request: PostStatusRequest
): Promise<TweeterResponse> => {
    await statusService.postStatus(request.token!, request.newStatus);

    return {
        success: true,
        message: "Status posted",
    };
};
