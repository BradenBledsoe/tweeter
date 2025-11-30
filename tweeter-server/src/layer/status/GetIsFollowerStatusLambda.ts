import {
    IsFollowerStatusRequest,
    IsFollowerStatusResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { bootstrap } from "../ServiceBoostrap";

const statusService = new StatusService(bootstrap.factory, bootstrap.auth);

export const handler = async (
    request: IsFollowerStatusRequest
): Promise<IsFollowerStatusResponse> => {
    const isFollower = await statusService.getIsFollowerStatus(
        request.token!,
        request.user,
        request.selectedUser
    );

    return {
        success: true,
        message: null,
        isFollower: isFollower,
    };
};
