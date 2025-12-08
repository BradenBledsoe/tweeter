import { TweeterResponse } from "./TweeterResponse";
import { UserDto } from "../../dto/UserDto";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface AuthResponse extends TweeterResponse {
    readonly token: AuthTokenDto;
    readonly user: UserDto;
}
