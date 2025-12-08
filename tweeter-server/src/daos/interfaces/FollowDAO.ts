import { UserDto } from "tweeter-shared";
export interface FollowDAO {
    follow(followerAlias: string, followeeAlias: string): Promise<void>;
    unfollow(followerAlias: string, followeeAlias: string): Promise<void>;
    isFollowing(followerAlias: string, followeeAlias: string): Promise<boolean>;
    getFollowees(
        followerAlias: string,
        lastFolloweeAlias: string | null,
        limit: number
    ): Promise<[UserDto[], boolean]>;
    getFollowers(
        followeeAlias: string,
        lastFollowerAlias: string | null,
        limit: number
    ): Promise<[UserDto[], boolean]>;
    getFolloweeCount(followerAlias: string): Promise<number>;
    getFollowerCount(followeeAlias: string): Promise<number>;
    getAllFollowers(followeeAlias: string): Promise<string[]>;
}
