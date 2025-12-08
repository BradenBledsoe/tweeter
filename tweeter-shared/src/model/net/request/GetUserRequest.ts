import { TweeterRequest } from "./TweeterRequest";

export interface GetUserRequest extends TweeterRequest {
    readonly token: string;
    readonly userAlias: string;
}
