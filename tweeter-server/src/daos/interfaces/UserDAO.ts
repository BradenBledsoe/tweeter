import { UserDto } from "tweeter-shared";

export interface UserDAO {
    getByAlias(alias: string): Promise<UserDto | null>;
    validateCredentials(
        alias: string,
        password: string
    ): Promise<UserDto | null>;
    create(user: UserDto, hashedPassword: string): Promise<void>;
    // Increment or decrement the denormalized follower_count for the user
    // only if the attribute already exists on the item. Implementations
    // should silently return if the attribute does not exist.
    adjustFollowerCountIfExists?(alias: string, delta: number): Promise<void>;
}
