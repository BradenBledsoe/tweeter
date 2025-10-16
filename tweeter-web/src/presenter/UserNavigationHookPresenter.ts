import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";
import { Presenter } from "./Presenter";

export interface UserNavigationHookView {
    displayErrorMessage: (message: string) => void;
    setDisplayedUser: (user: User) => void;
    navigate: NavigateFunction;
}

export class UserNavigationHookPresenter extends Presenter<UserNavigationHookView> {
    private service = new UserService();

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

        await this.doFailureReportingOperation(async () => {
            const alias = this.extractAlias(event.target.toString());

            const toUser = await this.service.getUser(authToken, alias);

            if (toUser) {
                if (!toUser.equals(displayedUser)) {
                    this.view.setDisplayedUser(toUser);
                    this.view.navigate(`${featurePath}/${toUser.alias}`);
                }
            }
        }, "get user");
    }
}
