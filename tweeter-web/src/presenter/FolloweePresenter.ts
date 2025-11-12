import { AuthToken, User, PagedUserItemRequest } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
    protected itemDescription(): string {
        return "load followees";
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
        return this.service.loadMoreFollowees(request);
    }
}
