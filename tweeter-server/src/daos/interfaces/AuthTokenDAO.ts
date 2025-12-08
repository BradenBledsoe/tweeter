export interface AuthTokenDAO {
    create(token: string, userAlias: string, timestamp: number): Promise<void>;
    validate(token: string): Promise<string | null>;
    delete(token: string): Promise<void>;
    refresh(token: string, newTimestamp: number): Promise<void>;
}
