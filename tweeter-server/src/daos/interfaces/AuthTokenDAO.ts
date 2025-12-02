import { AuthTokenRecord } from "../../layer/model/persistence/AuthTokenRecord";

export interface AuthTokenDAO {
    putToken(token: AuthTokenRecord): Promise<void>;
    getToken(token: string): Promise<AuthTokenRecord | null>;
    deleteToken(token: string): Promise<void>;
}
