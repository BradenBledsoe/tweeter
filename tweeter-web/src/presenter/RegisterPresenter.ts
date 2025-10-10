import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavigateFunction } from "react-router-dom";

export interface RegisterView {
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

export class RegisterPresenter {
    private service: UserService;
    private _view: RegisterView;

    public constructor(view: RegisterView) {
        this._view = view;
        this.service = new UserService();
    }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        imageFileExtension: string,
        rememberMe: boolean
    ) {
        try {
            this._view.setIsLoading(true);

            const [user, authToken] = await this.service.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageFileExtension
            );

            this._view.updateUserInfo(user, user, authToken, rememberMe);
            this._view.navigate(`/feed/${user.alias}`);
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to register user because of exception: ${error}`
            );
        } finally {
            this._view.setIsLoading(false);
        }
    }
}
