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
        const lastKey = lastItem?.alias;
        return this.factory
            .followDAO()
            .listFollowers(userAlias, pageSize, lastKey);
    }

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        await this.auth.requireAuthorized(token);
        const lastKey = lastItem?.alias;
        return this.factory
            .followDAO()
            .listFollowees(userAlias, pageSize, lastKey);
    }

    public async getFolloweeCount(
        token: string,
        alias: string
    ): Promise<number> {
        await this.auth.requireAuthorized(token);
        return this.factory.followDAO().getFolloweeCount(alias);
    }

    public async getFollowerCount(
        token: string,
        alias: string
    ): Promise<number> {
        await this.auth.requireAuthorized(token);
        return this.factory.followDAO().getFollowerCount(alias);
    }

    public async follow(
        token: string,
        userToFollowAlias: string
    ): Promise<[followerCount: number, followeeCount: number]> {
        const followerAlias = await this.auth.requireAuthorized(token);
        await this.factory.followDAO().follow(followerAlias, userToFollowAlias);
        const followerCount = await this.factory
            .followDAO()
            .getFollowerCount(userToFollowAlias);
        const followeeCount = await this.factory
            .followDAO()
            .getFolloweeCount(followerAlias);
        return [followerCount, followeeCount];
    }

    public async unfollow(
        token: string,
        userToUnfollowAlias: string
    ): Promise<[followerCount: number, followeeCount: number]> {
        const followerAlias = await this.auth.requireAuthorized(token);
        await this.factory
            .followDAO()
            .unfollow(followerAlias, userToUnfollowAlias);
        const followerCount = await this.factory
            .followDAO()
            .getFollowerCount(userToUnfollowAlias);
        const followeeCount = await this.factory
            .followDAO()
            .getFolloweeCount(followerAlias);
        return [followerCount, followeeCount];
    }
}
