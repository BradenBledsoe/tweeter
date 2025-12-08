import { TweeterResponse } from "./TweeterResponse";

export interface GetItemCountResponse extends TweeterResponse {
    readonly count: number;
}
