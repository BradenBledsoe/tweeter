import { FakeData, Status, StatusDto, UserDto } from "tweeter-shared";
import { AuthorizationService } from "../../auth/AuthorizationService";
import { DAOFactory } from "../../../daos/DAOFactory";
import { StatusItem } from "../persistence/StatusItem";

export class StatusService {
    constructor(
        private factory: DAOFactory,
        private auth: AuthorizationService
    ) {}

    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        await this.auth.requireAuthorized(token);
        return this.factory
            .createStatusDAO()
            .getPageOfStatuses(userAlias, pageSize, lastItem);
    }

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        await this.auth.requireAuthorized(token);
        return this.factory
            .createFeedDAO()
            .getPageOfFeedItems(userAlias, pageSize, lastItem);
    }

    public async postStatus(
        token: string,
        newStatus: StatusDto
    ): Promise<void> {
        const alias = await this.auth.requireAuthorized(token);

        const item: StatusItem = {
            ...newStatus,
            userAlias: alias, // top-level partition key
            user: { ...newStatus.user, alias }, // keep nested user object
        };

        // 1. Put status in stories table
        await this.factory.createStatusDAO().putStatus(item);

        // 2. Fan-out to followers’ feeds
        const followers = await this.factory
            .createFollowDAO()
            .getFollowers(alias, 100, undefined);
        const [users] = followers;
        for (const follower of users) {
            await this.factory
                .createFeedDAO()
                .batchPutFeedItems(follower.alias, [newStatus]);
        }
    }

    public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
    ): Promise<boolean> {
        const requesterAlias = await this.auth.requireAuthorized(token);
        const follow = await this.factory
            .createFollowDAO()
            .getFollow(user.alias, selectedUser.alias);
        return follow !== null;
    }
}
