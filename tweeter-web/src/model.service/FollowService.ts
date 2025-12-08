import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service {
    private serverFacade = new ServerFacade();

    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastFollowee: User | null
    ): Promise<[User[], boolean]> {
        return this.serverFacade.getMoreFollowees(
            authToken.token,
            userAlias,
            pageSize,
            lastFollowee
        );
    }

    public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastFollower: User | null
    ): Promise<[User[], boolean]> {
        return this.serverFacade.getMoreFollowers(
            authToken.token,
            userAlias,
            pageSize,
            lastFollower
        );
    }

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean> {
        return this.serverFacade.isFollower(
            authToken.token,
            user,
            selectedUser
        );
    }

    public async getFolloweeCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        return this.serverFacade.getFolloweeCount(authToken.token, user);
    }

    public async getFollowerCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        return this.serverFacade.getFollowerCount(authToken.token, user);
    }

    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        return this.serverFacade.follow(authToken.token, userToFollow);
    }

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        return this.serverFacade.unfollow(authToken.token, userToUnfollow);
    }
}
