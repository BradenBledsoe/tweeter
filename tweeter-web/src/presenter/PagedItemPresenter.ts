import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";
import { Service } from "../model.service/Service";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
    addItems: (items: T[]) => void;
}

export abstract class PagedItemPresenter<
    T,
    U extends Service
> extends Presenter<PagedItemView<T>> {
    private userService = new UserService();
    private _hasMoreItems = true;
    private _lastItem: T | null = null;
    private _service: U;

    public constructor(view: PagedItemView<T>) {
        super(view);
        this._service = this.serviceFactory();
    }

    protected abstract serviceFactory(): U;

    public get hasMoreItems() {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(value: T | null) {
        this._lastItem = value;
    }

    protected get service() {
        return this._service;
    }

    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.userService.getUser({
            token: authToken.token,
            userAlias: alias,
        });
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        await this.doFailureReportingOperation(async () => {
            const [newItems, hasMore] = await this.getMoreItems(
                authToken,
                userAlias
            );

            this.hasMoreItems = hasMore;
            this.lastItem =
                newItems.length > 0 ? newItems[newItems.length - 1] : null;
            this.view.addItems(newItems);
        }, this.itemDescription());
    }

    protected abstract itemDescription(): string;

    protected abstract getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[T[], boolean]>;
}
