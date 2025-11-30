import { AuthTokenDto, FakeData, UserDto } from "tweeter-shared";
import { DAOFactory } from "../../../daos/DAOFactory";
import { AuthorizationService } from "../../auth/AuthorizationService";
import bcrypt from "bcryptjs/umd/types";

export class UserService {
    constructor(
        private factory: DAOFactory,
        private auth: AuthorizationService
    ) {}

    public async getUser(
        token: string,
        alias: string
    ): Promise<UserDto | null> {
        await this.auth.requireAuthorized(token);
        return this.factory.userDAO().getUser(alias);
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[UserDto, AuthTokenDto]> {
        const ok = await this.factory.userDAO().verifyPassword(alias, password);
        if (!ok) throw new Error("UNAUTHORIZED: Invalid credentials");

        const user = await this.factory.userDAO().getUser(alias);
        if (!user) throw new Error("NOT_FOUND: User does not exist");

        // Create token with timestamp
        const token = crypto.randomUUID();
        const timestamp = Date.now(); // ms since epoch
        const authToken: AuthTokenDto = { token, timestamp };

        await this.factory.authTokenDAO().putToken(authToken);
        return [user, authToken];
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string,
        imageFileExtension: string
    ): Promise<[UserDto, AuthTokenDto]> {
        const s3 = this.factory.s3DAO();

        // Always upload the image, no fallback
        const imageUrl = await s3.uploadProfileImage(
            alias,
            userImageBytes,
            imageFileExtension
        );

        const passwordHash = await bcrypt.hash(password, 10);

        const user: UserDto = {
            alias,
            firstName,
            lastName,
            imageUrl, // guaranteed string
        };

        await this.factory.userDAO().createUser(user, passwordHash, imageUrl);

        const token = crypto.randomUUID();
        const timestamp = Date.now();
        const authToken: AuthTokenDto = { token, timestamp };
        await this.factory.authTokenDAO().putToken(authToken);

        return [user, authToken];
    }

    public async logout(token: string): Promise<void> {
        await this.auth.requireAuthorized(token);
        await this.factory.authTokenDAO().deleteToken(token);
    }
}
