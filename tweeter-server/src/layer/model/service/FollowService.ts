import { FakeData, User, UserDto } from "tweeter-shared";

export class FollowService {
    private async getFakeDataUsers(
        lastItem: UserDto | null,
        pageSize: number,
        userAlias: string
    ): Promise<[UserDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfUsers(
            User.fromDto(lastItem),
            pageSize,
            userAlias
        );
        const dtos = items.map((user) => user.dto);
        return [dtos, hasMore];
    }

    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeDataUsers(lastItem, pageSize, userAlias);
    }

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeDataUsers(lastItem, pageSize, userAlias);
    }

    public async getFolloweeCount(
        token: string,
        alias: string
    ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFolloweeCount(alias);
    }

    public async getFollowerCount(
        token: string,
        alias: string
    ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFollowerCount(alias);
    }

    public async follow(
        authToken: string,
        userToFollowAlias: string
    ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        //await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server

        const followerCount = await this.getFollowerCount(
            authToken,
            userToFollowAlias
        );
        const followeeCount = await this.getFolloweeCount(
            authToken,
            userToFollowAlias
        );

        return [followerCount, followeeCount];
    }

    public async unfollow(
        authToken: string,
        userToUnfollowAlias: string
    ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        //await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server

        const followerCount = await this.getFollowerCount(
            authToken,
            userToUnfollowAlias
        );
        const followeeCount = await this.getFolloweeCount(
            authToken,
            userToUnfollowAlias
        );

        return [followerCount, followeeCount];
    }
}
