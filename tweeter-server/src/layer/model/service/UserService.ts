import { AuthTokenDto, FakeData, UserDto } from "tweeter-shared";

export class UserService {
    public async getUser(
        token: string,
        alias: string
    ): Promise<UserDto | null> {
        // TODO: Replace with the result of calling server
        const user = FakeData.instance.findUserByAlias(alias);
        return user!.dto;
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[UserDto, AuthTokenDto]> {
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid alias or password");
        }

        const authToken = FakeData.instance.authToken;

        return [user.dto, authToken.dto];
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string,
        imageFileExtension: string
    ): Promise<[UserDto, AuthTokenDto]> {
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid registration");
        }

        const authToken = FakeData.instance.authToken;

        return [user.dto, authToken.dto];
    }

    public async logout(token: string): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        //await new Promise((res) => setTimeout(res, 1000));
    }
}
