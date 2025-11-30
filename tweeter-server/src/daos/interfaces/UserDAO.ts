import { UserDto } from "tweeter-shared";

export interface UserDAO {
    getUser(alias: string): Promise<UserDto | null>;
    createUser(
        user: UserDto,
        passwordHash: string,
        imageUrl?: string
    ): Promise<void>;
    updateProfileImage(alias: string, imageUrl: string): Promise<void>;
    verifyPassword(alias: string, password: string): Promise<boolean>;
}
