import { TweeterResponse } from "./TweeterResponse";

export interface IsFollowerStatusResponse extends TweeterResponse {
    readonly isFollower: boolean;
}
