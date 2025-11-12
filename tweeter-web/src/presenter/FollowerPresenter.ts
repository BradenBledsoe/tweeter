import { AuthToken, PagedUserItemRequest, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
    protected itemDescription(): string {
        return "load followers";
    }

    protected getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[User[], boolean]> {
        const request: PagedUserItemRequest = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: PAGE_SIZE,
            lastItem: this.lastItem?.dto ?? null,
        };
        return this.service.loadMoreFollowers(request);
    }
}
