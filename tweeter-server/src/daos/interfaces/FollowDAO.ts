import { UserDto } from "tweeter-shared";

export interface FollowDAO {
    follow(followerAlias: string, followeeAlias: string): Promise<void>;
    unfollow(followerAlias: string, followeeAlias: string): Promise<void>;
    listFollowers(
        followeeAlias: string,
        pageSize: number,
        lastKey?: string
    ): Promise<[UserDto[], boolean]>;
    listFollowees(
        followerAlias: string,
        pageSize: number,
        lastKey?: string
    ): Promise<[UserDto[], boolean]>;
    getFollowerCount(alias: string): Promise<number>;
    getFolloweeCount(alias: string): Promise<number>;
    isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
}
