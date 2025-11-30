import { FakeData, Status, StatusDto, UserDto } from "tweeter-shared";
import { AuthorizationService } from "../../auth/AuthorizationService";
import { DAOFactory } from "../../../daos/DAOFactory";

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
        const lastKey = lastItem ? String(lastItem.timestamp) : undefined;
        return this.factory.statusDAO().listStory(userAlias, pageSize, lastKey);
    }

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        await this.auth.requireAuthorized(token);
        const lastKey = lastItem ? String(lastItem.timestamp) : undefined;
        return this.factory.statusDAO().listFeed(userAlias, pageSize, lastKey);
    }

    public async postStatus(
        token: string,
        newStatus: StatusDto
    ): Promise<void> {
        const alias = await this.auth.requireAuthorized(token);
        // Ensure timestamp is set
        const status: StatusDto = {
            post: newStatus.post,
            user: newStatus.user, // full UserDto of the poster
            timestamp: newStatus.timestamp ?? Date.now(),
        };

        // Write to the poster's story
        await this.factory.statusDAO().putStatus(alias, status);

        // Fan-out to followers' feeds
        await this.factory.statusDAO().fanOutStatus(alias, status);
    }

    public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
    ): Promise<boolean> {
        const requesterAlias = await this.auth.requireAuthorized(token);
        const followerAlias = user.alias ?? requesterAlias;
        return this.factory
            .followDAO()
            .isFollower(followerAlias, selectedUser.alias);
    }
}
