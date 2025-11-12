import { AuthToken, LoginRequest, TweeterRequest, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";
import { Buffer } from "buffer";

export class UserService implements Service {
    private serverFacade = new ServerFacade();
    public async getUser(request: TweeterRequest): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return await this.serverFacade.getUser(request);
    }

    public async login(request: LoginRequest): Promise<[User, AuthToken]> {
        // TODO: Replace with the result of calling the server
        return await this.serverFacade.login(request);
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        // TODO: Replace with the result of calling the server
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string =
            Buffer.from(userImageBytes).toString("base64");

        return await this.serverFacade.register({
            firstName: firstName,
            lastName: lastName,
            userAlias: alias,
            password: password,
            userImageBytes: imageStringBase64,
            imageFileExtension: imageFileExtension,
        });
    }

    public async logout(request: TweeterRequest): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await this.serverFacade.logout(request);
    }
}
