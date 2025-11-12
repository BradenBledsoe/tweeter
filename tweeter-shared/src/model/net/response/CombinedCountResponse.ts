import { TweeterResponse } from "./TweeterResponse";

export interface CombinedCountResponse extends TweeterResponse {
    readonly followerCount: number;
    readonly followeeCount: number;
}
