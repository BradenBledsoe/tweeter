import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";

export interface LoginView {
    displayErrorMessage: (message: string) => void;
    navigate: NavigateFunction;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
}

export class LoginPresenter {
    private service: UserService;
    private _view: LoginView;

    public constructor(view: LoginView) {
        this._view = view;
        this.service = new UserService();
    }

    public async doLogin(
        alias: string,
        password: string,
        originalUrl: string | undefined,
        rememberMe: boolean
    ) {
        try {
            this._view.setIsLoading(true);

            const [user, authToken] = await this.service.login(alias, password);

            this._view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!originalUrl) {
                this._view.navigate(originalUrl);
            } else {
                this._view.navigate(`/feed/${user.alias}`);
            }
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        } finally {
            this._view.setIsLoading(false);
        }
    }
}
