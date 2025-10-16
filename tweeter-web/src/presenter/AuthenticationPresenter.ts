import { AuthToken, User } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model.service/UserService";

export interface AuthenticationView extends View {
    navigate: NavigateFunction;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
}

export abstract class AuthenticationPresenter<
    V extends AuthenticationView
> extends Presenter<V> {
    protected service = new UserService();
    public async doAuthenticationOperation(
        alias: string,
        password: string,
        rememberMe: boolean,
        originalUrl?: string | undefined,
        firstName?: string,
        lastName?: string,
        imageBytes?: Uint8Array,
        imageFileExtension?: string
    ) {
        await this.doFailureReportingOperation(
            async () => {
                this.view.setIsLoading(true);

                const [user, authToken] = await this.authenticateUser(
                    alias,
                    password,
                    firstName,
                    lastName,
                    imageBytes,
                    imageFileExtension
                );

                this.view.updateUserInfo(user, user, authToken, rememberMe);

                const navigateUrl = this.getPostAuthRedirectUrl(
                    user,
                    originalUrl
                );
                this.view.navigate(navigateUrl);
            },
            this.itemDescription(),
            async () => {
                this.view.setIsLoading(false);
            }
        );
    }

    protected abstract getPostAuthRedirectUrl(
        user: User,
        originalUrl?: string
    ): string;

    protected abstract itemDescription(): string;

    protected abstract authenticateUser(
        alias: string,
        password: string,
        firstName?: string,
        lastName?: string,
        imageBytes?: Uint8Array,
        imageFileExtension?: string
    ): Promise<[User, AuthToken]>;
}
