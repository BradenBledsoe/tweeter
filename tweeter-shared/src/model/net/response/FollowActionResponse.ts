import { TweeterResponse } from "./TweeterResponse";

export interface FollowActionResponse extends TweeterResponse {
    readonly followerCount: number;
    readonly followeeCount: number;
}
