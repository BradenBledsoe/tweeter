import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";

export interface UserNavigationHookView {
    displayErrorMessage: (message: string) => void;
    setDisplayedUser: (user: User) => void;
    navigate: NavigateFunction;
}

export class UserNavigationHookPresenter {
    private service: UserService;
    private _view: UserNavigationHookView;

    public constructor(view: UserNavigationHookView) {
        this._view = view;
        this.service = new UserService();
    }

    private extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };

    public async navigateToUser(
        event: React.MouseEvent,
        featurePath: string,
        authToken: AuthToken,
        displayedUser: User
    ): Promise<void> {
        event.preventDefault();

        try {
            const alias = this.extractAlias(event.target.toString());

            const toUser = await this.service.getUser(authToken, alias);

            if (toUser) {
                if (!toUser.equals(displayedUser)) {
                    this._view.setDisplayedUser(toUser);
                    this._view.navigate(`${featurePath}/${toUser.alias}`);
                }
            }
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to get user because of exception: ${error}`
            );
        }
    }

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.service.getUser(authToken, alias);
    }
}
