import {
    AuthenticationPresenter,
    AuthenticationView,
} from "./AuthenticationPresenter";
import { AuthToken, User } from "tweeter-shared";

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
    public async doLogin(
        alias: string,
        password: string,
        originalUrl: string | undefined,
        rememberMe: boolean
    ) {
        await this.doAuthenticationOperation(
            alias,
            password,
            rememberMe,
            originalUrl
        );
    }

    protected getPostAuthRedirectUrl(user: User, originalUrl?: string): string {
        return originalUrl ? originalUrl : `/feed/${user.alias}`;
    }

    protected itemDescription(): string {
        return "log user in";
    }

    protected authenticateUser(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        return this.service.login(alias, password);
    }
}
