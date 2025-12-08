import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowActionRequest extends TweeterRequest {
    readonly token: string;
    readonly user: UserDto;
}
