import {
    IsFollowerStatusRequest,
    IsFollowerStatusResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (
    request: IsFollowerStatusRequest
): Promise<IsFollowerStatusResponse> => {
    const statusService = new StatusService();
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
