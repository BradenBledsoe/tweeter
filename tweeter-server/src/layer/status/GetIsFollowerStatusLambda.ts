import {
    IsFollowerStatusRequest,
    IsFollowerStatusResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { AuthorizationService } from "../auth/AuthorizationService";

export const handler = async (
    request: IsFollowerStatusRequest
): Promise<IsFollowerStatusResponse> => {
    const factory = new DynamoDAOFactory();
    const auth = new AuthorizationService(factory.createAuthTokenDAO());
    const statusService = new StatusService(factory, auth);

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
