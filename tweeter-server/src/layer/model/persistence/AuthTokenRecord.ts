import { AuthTokenDto } from "tweeter-shared";

// src/layer/model/persistence/AuthTokenRecord.ts
export interface AuthTokenRecord extends AuthTokenDto {
    token: string;
    timestamp: number;
    userAlias: string;
}
