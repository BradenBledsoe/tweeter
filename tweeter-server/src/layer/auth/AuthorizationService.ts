// src/layer/auth/AuthorizationService.ts
import { AuthTokenDAO } from "../../daos/interfaces/AuthTokenDAO";

export class AuthorizationService {
    constructor(private tokenDAO: AuthTokenDAO) {}

    async requireAuthorized(token: string): Promise<string> {
        if (!token) throw new Error("UNAUTHORIZED: Missing token");

        const record = await this.tokenDAO.getToken(token);
        const now = Date.now();
        const maxAgeMs = 15 * 60 * 1000; // 15 minutes

        if (!record || now - record.timestamp > maxAgeMs) {
            throw new Error("UNAUTHORIZED: Invalid or expired token");
        }

        return record.token; // or record.userAlias if stored separately
    }
}
