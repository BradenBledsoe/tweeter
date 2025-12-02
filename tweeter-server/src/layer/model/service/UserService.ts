import { AuthTokenDto, FakeData, UserDto } from "tweeter-shared";
import { DAOFactory } from "../../../daos/DAOFactory";
import { AuthorizationService } from "../../auth/AuthorizationService";
import * as bcrypt from "bcryptjs";
import { AuthTokenRecord } from "../persistence/AuthTokenRecord";
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
        return this.factory.createUserDAO().getUser(alias);
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[UserDto, AuthTokenDto]> {
        // get stored hash
        const hash = await this.factory.createUserDAO().getPasswordHash(alias);
        if (!hash || !(await bcrypt.compare(password, hash))) {
            throw new Error("unauthorized: Invalid credentials");
        }

        const user = await this.factory.createUserDAO().getUser(alias);
        if (!user) throw new Error("bad-request: User does not exist");

        const token = crypto.randomUUID();
        const timestamp = Date.now();
        const authToken: AuthTokenRecord = {
            token,
            timestamp,
            userAlias: alias,
        };

        await this.factory.createAuthTokenDAO().putToken(authToken);
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
        const s3 = this.factory.createS3DAO();

        // upload profile image
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
            imageUrl,
        };

        await this.factory.createUserDAO().createUser(user, passwordHash);

        const token = crypto.randomUUID();
        const timestamp = Date.now();
        const authToken: AuthTokenRecord = {
            token,
            timestamp,
            userAlias: alias,
        };

        await this.factory.createAuthTokenDAO().putToken(authToken);
        return [user, authToken];
    }

    public async logout(token: string): Promise<void> {
        console.log("Logging out token:", token);
        await this.auth.requireAuthorized(token);
        await this.factory.createAuthTokenDAO().deleteToken(token);
    }
}
