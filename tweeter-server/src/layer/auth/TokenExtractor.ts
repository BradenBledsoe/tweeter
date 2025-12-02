import { TweeterRequest } from "tweeter-shared";

export function extractToken(request: TweeterRequest): string {
    const token = (request as any).token ?? (request as any)._token;
    if (!token) {
        throw new Error("unauthorized: Missing token");
    }
    return token;
}
