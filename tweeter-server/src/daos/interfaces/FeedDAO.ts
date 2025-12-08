import { StatusDto } from "tweeter-shared";

export interface FeedDAO {
    addStatusToFeeds(
        status: StatusDto,
        followerAliases: string[]
    ): Promise<void>;
    getFeed(
        feedOwnerAlias: string,
        lastTimestamp: number | null,
        limit: number
    ): Promise<[StatusDto[], boolean]>;
}
