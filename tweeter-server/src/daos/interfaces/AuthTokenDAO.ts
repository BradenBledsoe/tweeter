import { AuthTokenDto } from "tweeter-shared";

export interface AuthTokenDAO {
    putToken(token: AuthTokenDto): Promise<void>;
    getToken(token: string): Promise<AuthTokenDto | null>;
    deleteToken(token: string): Promise<void>;
}
