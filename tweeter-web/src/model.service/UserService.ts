import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
    private serverFacade = new ServerFacade();

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.serverFacade.getUser(authToken.token, alias);
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        const [user, token] = await this.serverFacade.login(alias, password);
        return [user, new AuthToken(token, Date.now())];
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        // Not needed now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string =
            Buffer.from(userImageBytes).toString("base64");

        const [user, token] = await this.serverFacade.register(
            firstName,
            lastName,
            alias,
            password,
            imageStringBase64,
            imageFileExtension
        );
        return [user, new AuthToken(token, Date.now())];
    }

    public async logout(authToken: AuthToken): Promise<void> {
        await this.serverFacade.logout(authToken.token);
    }
}
