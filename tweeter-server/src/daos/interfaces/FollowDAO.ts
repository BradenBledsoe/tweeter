import { UserDto } from "tweeter-shared";
export interface FollowDAO {
    follow(follower: UserDto, followee: UserDto): Promise<void>;
    unfollow(followerAlias: string, followeeAlias: string): Promise<void>;
    getFollowers(
        followeeAlias: string,
        pageSize: number,
        lastFollowerAlias?: string
    ): Promise<[UserDto[], boolean]>;
    getFollowees(
        followerAlias: string,
        pageSize: number,
        lastFolloweeAlias?: string
    ): Promise<[UserDto[], boolean]>;
    getFollowerCount(followeeAlias: string): Promise<number>;
    getFolloweeCount(followerAlias: string): Promise<number>;
    getFollow(followerAlias: string, followeeAlias: string): Promise<boolean>;
}
