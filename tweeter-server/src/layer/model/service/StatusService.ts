import { StatusDto } from "tweeter-shared";
import { DAOFactory } from "../../../daos/DAOFactory";
import { AuthTokenDAO } from "../../../daos/interfaces/AuthTokenDAO";
import { FeedDAO } from "../../../daos/interfaces/FeedDAO";
import { StatusDAO } from "../../../daos/interfaces/StatusDAO";

export class StatusService {
    private authTokenDao: AuthTokenDAO;
    private statusDao: StatusDAO;
    private feedDao: FeedDAO;

    constructor(factory: DAOFactory) {
        this.authTokenDao = factory.createAuthTokenDAO();
        this.statusDao = factory.createStatusDAO();
        this.feedDao = factory.createFeedDAO();
    }

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        // validate token
        const validated = await this.authTokenDao.validate(token);
        if (!validated) {
            throw new Error("Invalid or expired auth token");
        }

        const lastTimestamp = lastItem ? lastItem.timestamp : null;
        return this.feedDao.getFeed(userAlias, lastTimestamp, pageSize);
    }

    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        // validate token
        const validated = await this.authTokenDao.validate(token);
        if (!validated) {
            throw new Error("Invalid or expired auth token");
        }

        const lastTimestamp = lastItem ? lastItem.timestamp : null;
        return this.statusDao.getUserStory(userAlias, lastTimestamp, pageSize);
    }

    public async postStatus(
        token: string,
        newStatus: StatusDto
    ): Promise<StatusDto> {
        // validate token and get poster alias
        const posterAlias = await this.authTokenDao.validate(token);
        if (!posterAlias) {
            throw new Error("Invalid or expired auth token");
        }

        if (posterAlias !== newStatus.user.alias) {
            throw new Error("Authenticated user does not match status author");
        }

        const statusToSave: StatusDto = { ...newStatus, timestamp: Date.now() };
        await this.statusDao.create(statusToSave);
        // Fan-out to followers' feeds is now handled asynchronously via SQS.
        return statusToSave;
    }
}
