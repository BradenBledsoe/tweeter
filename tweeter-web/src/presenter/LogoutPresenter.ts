import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";

export interface LogoutView {
    displayErrorMessage: (message: string) => void;
    navigate: NavigateFunction;
    displayInfoMessage: (
        message: string,
        duration: number,
        bootstrapClasses?: string | undefined
    ) => string;
    deleteMessage: (messageId: string) => void;
    clearUserInfo: () => void;
}

export class LogoutPresenter {
    private service: UserService;
    private _view: LogoutView;

    public constructor(view: LogoutView) {
        this._view = view;
        this.service = new UserService();
    }

    public async logOut(authToken: AuthToken) {
        const loggingOutToastId = this._view.displayInfoMessage(
            "Logging Out...",
            0
        );

        try {
            await this.service.logout(authToken!);

            this._view.deleteMessage(loggingOutToastId);
            this._view.clearUserInfo();
            this._view.navigate("/login");
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to log user out because of exception: ${error}`
            );
        }
    }
}
