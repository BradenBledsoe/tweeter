import { TweeterResponse } from "./TweeterResponse";

export interface UserItemCountResponse extends TweeterResponse {
    readonly count: number;
}
