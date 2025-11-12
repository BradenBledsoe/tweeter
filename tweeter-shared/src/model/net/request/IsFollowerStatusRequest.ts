import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface IsFollowerStatusRequest extends TweeterRequest {
    readonly user: UserDto;
    readonly selectedUser: UserDto;
}
