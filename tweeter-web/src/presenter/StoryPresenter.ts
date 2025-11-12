import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
    protected itemDescription(): string {
        return "load story items";
    }

    protected getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[Status[], boolean]> {
        return this.service.loadMoreStoryItems({
            token: authToken.token,
            userAlias: userAlias,
            pageSize: PAGE_SIZE,
            lastItem: this.lastItem?.dto ?? null,
        });
    }
}
