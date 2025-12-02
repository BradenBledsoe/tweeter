import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../../daos/dynamo/DynamoDAOFactory";
import { AuthorizationService } from "../auth/AuthorizationService";

export const handler = async (
    request: PostStatusRequest
): Promise<TweeterResponse> => {
    const factory = new DynamoDAOFactory();
    const auth = new AuthorizationService(factory.createAuthTokenDAO());
    const statusService = new StatusService(factory, auth);

    try {
        await statusService.postStatus(request.token!, request.newStatus);

        return {
            success: true,
            message: "Status posted",
        };
    } catch (error: any) {
        throw new Error(`${error.message}`);
    }
};
