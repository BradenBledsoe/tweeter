import { StatusDto } from "tweeter-shared";

export interface FeedDAO {
    batchPutFeedItems(userAlias: string, items: StatusDto[]): Promise<void>;
    getPageOfFeedItems(
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]>;
    deleteFeedItem(userAlias: string, statusId: string): Promise<void>;
}
