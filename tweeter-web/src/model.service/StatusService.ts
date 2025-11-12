import {
    IsFollowerStatusRequest,
    PagedStatusItemRequest,
    PostStatusRequest,
    Status,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
    private serverFacade = new ServerFacade();
    public async loadMoreStoryItems(
        request: PagedStatusItemRequest
    ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        return await this.serverFacade.getMoreStoryItems(request);
    }

    public async loadMoreFeedItems(
        request: PagedStatusItemRequest
    ): Promise<[Status[], boolean]> {
        // TODO: Replace with the result of calling server
        return await this.serverFacade.getMoreFeedItems(request);
    }

    public async postStatus(request: PostStatusRequest): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        //await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server to post the status
        await this.serverFacade.postStatus(request);
    }

    public async getIsFollowerStatus(
        request: IsFollowerStatusRequest
    ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        return await this.serverFacade.getIsFollowerStatus(request);
    }
}
