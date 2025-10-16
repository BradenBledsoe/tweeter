import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";
import { MessageView, Presenter } from "./Presenter";

export interface LogoutView extends MessageView {
    navigate: NavigateFunction;
    clearUserInfo: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
    private service = new UserService();

    public async logOut(authToken: AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage(
            "Logging Out...",
            0
        );

        await this.doFailureReportingOperation(async () => {
            await this.service.logout(authToken!);

            this.view.deleteMessage(loggingOutToastId);
            this.view.clearUserInfo();
            this.view.navigate("/login");
        }, "log user out");
    }
}
