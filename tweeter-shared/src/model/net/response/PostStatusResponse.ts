import { TweeterResponse } from "./TweeterResponse";

export interface PostStatusResponse extends TweeterResponse {
    // Post status only returns success/failure info from TweeterResponse
}
