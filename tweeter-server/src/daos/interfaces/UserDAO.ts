import { UserDto } from "tweeter-shared";

export interface UserDAO {
    getUser(alias: string): Promise<UserDto | null>;
    getPasswordHash(alias: string): Promise<string | null>;
    createUser(user: UserDto, passwordHash: string): Promise<void>;
}
