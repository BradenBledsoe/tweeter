import { AuthToken, Status } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
    private serverFacade = new ServerFacade();

    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return this.serverFacade.loadMoreFeedItems(
            authToken.token,
            userAlias,
            pageSize,
            lastItem
        );
    }

    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return this.serverFacade.loadMoreStoryItems(
            authToken.token,
            userAlias,
            pageSize,
            lastItem
        );
    }

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void> {
        return this.serverFacade.postStatus(authToken.token, newStatus);
    }
}
