import { FakeData, User, UserDto } from "tweeter-shared";
import { DAOFactory } from "../../../daos/DAOFactory";
import { AuthorizationService } from "../../auth/AuthorizationService";

export class FollowService {
    constructor(
        private factory: DAOFactory,
        private auth: AuthorizationService
    ) {}

    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        await this.auth.requireAuthorized(token);
        return this.factory
            .createFollowDAO()
            .getFollowers(userAlias, pageSize, lastItem?.alias);
    }

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        await this.auth.requireAuthorized(token);
        return this.factory
            .createFollowDAO()
            .getFollowees(userAlias, pageSize, lastItem?.alias);
    }

    public async getFolloweeCount(
        token: string,
        alias: string
    ): Promise<number> {
        await this.auth.requireAuthorized(token);
        return this.factory.createFollowDAO().getFolloweeCount(alias);
    }

    public async getFollowerCount(
        token: string,
        alias: string
    ): Promise<number> {
        await this.auth.requireAuthorized(token);
        return this.factory.createFollowDAO().getFollowerCount(alias);
    }

    public async follow(
        token: string,
        userToFollowAlias: string
    ): Promise<[followerCount: number, followeeCount: number]> {
        const alias = await this.auth.requireAuthorized(token);

        await this.factory.createFollowDAO().follow(
            { alias, firstName: "", lastName: "", imageUrl: "" },
            {
                alias: userToFollowAlias,
                firstName: "",
                lastName: "",
                imageUrl: "",
            }
        );

        const followerCount = await this.getFollowerCount(
            token,
            userToFollowAlias
        );
        const followeeCount = await this.getFolloweeCount(token, alias);

        return [followerCount, followeeCount];
    }

    public async unfollow(
        token: string,
        userToUnfollowAlias: string
    ): Promise<[followerCount: number, followeeCount: number]> {
        const alias = await this.auth.requireAuthorized(token);

        await this.factory
            .createFollowDAO()
            .unfollow(alias, userToUnfollowAlias);

        const followerCount = await this.getFollowerCount(
            token,
            userToUnfollowAlias
        );
        const followeeCount = await this.getFolloweeCount(token, alias);

        return [followerCount, followeeCount];
    }
}
