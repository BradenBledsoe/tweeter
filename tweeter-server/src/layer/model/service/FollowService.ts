import { UserDto } from "tweeter-shared";
import { DAOFactory } from "../../../daos/DAOFactory";
import { AuthTokenDAO } from "../../../daos/interfaces/AuthTokenDAO";
import { FollowDAO } from "../../../daos/interfaces/FollowDAO";

export class FollowService {
    private authTokenDao: AuthTokenDAO;
    private followDao: FollowDAO;

    constructor(factory: DAOFactory) {
        this.authTokenDao = factory.createAuthTokenDAO();
        this.followDao = factory.createFollowDAO();
    }

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastFollowee: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        // validate token (throws if invalid)
        const validated = await this.authTokenDao.validate(token);
        if (!validated) {
            throw new Error("Invalid or expired auth token");
        }

        const lastAlias = lastFollowee ? lastFollowee.alias : null;
        return this.followDao.getFollowees(userAlias, lastAlias, pageSize);
    }

    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastFollower: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        const validated = await this.authTokenDao.validate(token);
        if (!validated) {
            throw new Error("Invalid or expired auth token");
        }

        const lastAlias = lastFollower ? lastFollower.alias : null;
        return this.followDao.getFollowers(userAlias, lastAlias, pageSize);
    }

    public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
    ): Promise<boolean> {
        // Use the validated token owner as the follower
        const followerAlias = await this.authTokenDao.validate(token);
        if (!followerAlias) {
            throw new Error("Invalid or expired auth token");
        }
        return this.followDao.isFollowing(followerAlias, selectedUser.alias);
    }

    public async getFolloweeCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        const validated = await this.authTokenDao.validate(token);
        if (!validated) {
            throw new Error("Invalid or expired auth token");
        }
        return this.followDao.getFolloweeCount(user.alias);
    }

    public async getFollowerCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        const validated = await this.authTokenDao.validate(token);
        if (!validated) {
            throw new Error("Invalid or expired auth token");
        }
        // If the user DTO already contains a denormalized follower_count attribute, use it.
        // The shared UserDto doesn't declare this field, so access it dynamically.
        const maybeCount =
            (user as any).follower_count ??
            (user as any).followerCount ??
            (user as any).followers_count;
        if (maybeCount !== undefined && maybeCount !== null) {
            // Ensure numeric return
            const n = Number(maybeCount);
            if (!Number.isNaN(n)) {
                return n;
            }
        }
        // Fallback: compute from the follows table via DAO
        return this.followDao.getFollowerCount(user.alias);
    }

    public async follow(
        token: string,
        user: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        const followerAlias = await this.authTokenDao.validate(token);
        if (!followerAlias) {
            throw new Error("Invalid or expired auth token");
        }

        await this.followDao.follow(followerAlias, user.alias);

        const followerCount = await this.followDao.getFollowerCount(user.alias);
        const followeeCount = await this.followDao.getFolloweeCount(user.alias);
        return [followerCount, followeeCount];
    }

    public async unfollow(
        token: string,
        user: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        const followerAlias = await this.authTokenDao.validate(token);
        if (!followerAlias) {
            throw new Error("Invalid or expired auth token");
        }

        await this.followDao.unfollow(followerAlias, user.alias);

        const followerCount = await this.followDao.getFollowerCount(user.alias);
        const followeeCount = await this.followDao.getFolloweeCount(user.alias);
        return [followerCount, followeeCount];
    }
}
