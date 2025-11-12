import { TweeterRequest } from "./TweeterRequest";

export interface LoginRequest extends TweeterRequest {
    readonly password: string;
}
