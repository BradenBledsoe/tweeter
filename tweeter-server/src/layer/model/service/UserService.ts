import { AuthTokenDto, UserDto } from "tweeter-shared";
import { DAOFactory } from "../../../daos/DAOFactory";
import * as bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { UserDAO } from "../../../daos/interfaces/UserDAO";
import { AuthTokenDAO } from "../../../daos/interfaces/AuthTokenDAO";
import { S3DAO } from "../../../daos/interfaces/S3DAO";
export class UserService {
    private userDao: UserDAO;
    private authTokenDao: AuthTokenDAO;
    private s3Dao: S3DAO;

    constructor(factory: DAOFactory) {
        this.userDao = factory.createUserDAO();
        this.authTokenDao = factory.createAuthTokenDAO();
        this.s3Dao = factory.createS3DAO();
    }

    public async getUser(
        token: string,
        alias: string
    ): Promise<UserDto | null> {
        // Validate token
        const userAlias = await this.authTokenDao.validate(token);
        if (!userAlias) {
            throw new Error("Invalid or expired auth token");
        }
        // Fetch user
        return await this.userDao.getByAlias(alias);
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[UserDto, AuthTokenDto]> {
        // Validate credentials
        const user = await this.userDao.validateCredentials(alias, password);
        if (!user) {
            throw new Error("Invalid alias or password");
        }
        // Create auth token
        const token = uuid();
        const timestamp = Date.now();
        await this.authTokenDao.create(token, alias, timestamp);
        const authToken: AuthTokenDto = { token, timestamp };
        return [user, authToken];
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageStringBase64: string,
        imageFileExtension: string
    ): Promise<[UserDto, AuthTokenDto]> {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload image
        const imageFileName = `profile-images/${uuid()}.${imageFileExtension}`;
        const imageUrl = await this.s3Dao.putImage(
            imageFileName,
            imageStringBase64
        );

        // Create user
        const user: UserDto = {
            alias,
            firstName,
            lastName,
            imageUrl,
        };
        await this.userDao.create(user, hashedPassword);

        // Create auth token
        const token = uuid();
        const timestamp = Date.now();
        await this.authTokenDao.create(token, alias, timestamp);
        const authToken: AuthTokenDto = { token, timestamp };
        return [user, authToken];
    }

    public async logout(token: string): Promise<void> {
        await this.authTokenDao.delete(token);
    }
}
