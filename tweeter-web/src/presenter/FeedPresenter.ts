import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
    protected itemDescription(): string {
        return "load feed items";
    }

    protected getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[Status[], boolean]> {
        return this.service.loadMoreFeedItems({
            token: authToken.token,
            userAlias: userAlias,
            pageSize: PAGE_SIZE,
            lastItem: this.lastItem?.dto ?? null,
        });
    }
}
