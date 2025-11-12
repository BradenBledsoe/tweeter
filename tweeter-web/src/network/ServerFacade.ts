import {
    CombinedCountResponse,
    PagedUserItemRequest,
    PagedUserItemResponse,
    User,
    TweeterRequest,
    UserItemCountResponse,
    PagedStatusItemRequest,
    PagedStatusItemResponse,
    Status,
    PostStatusRequest,
    TweeterResponse,
    IsFollowerStatusRequest,
    IsFollowerStatusResponse,
    GetUserResponse,
    LoginRequest,
    AuthToken,
    AuthorizationResponse,
    RegisterRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
    private SERVER_URL =
        "https://41g30bda1j.execute-api.us-east-1.amazonaws.com/prod";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    public async getMoreFollowees(
        request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedUserItemRequest,
            PagedUserItemResponse
        >(request, "/followee/list");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const items: User[] | null =
            response.success && response.items
                ? response.items.map((dto) => User.fromDto(dto) as User)
                : null;

        // Handle errors
        if (response.success) {
            if (items == null) {
                throw new Error(`No followees found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async getMoreFollowers(
        request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedUserItemRequest,
            PagedUserItemResponse
        >(request, "/follower/list");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const items: User[] | null =
            response.success && response.items
                ? response.items.map((dto) => User.fromDto(dto) as User)
                : null;

        // Handle errors
        if (response.success) {
            if (items == null) {
                throw new Error(`No followers found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async getFolloweeCount(request: TweeterRequest): Promise<number> {
        const response = await this.clientCommunicator.doPost<
            TweeterRequest,
            UserItemCountResponse
        >(request, `/followee/count`);

        // Handle errors
        if (response.success) {
            if (response.count == null) {
                throw new Error(`No followees found`);
            } else {
                return response.count;
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async getFollowerCount(request: TweeterRequest): Promise<number> {
        const response = await this.clientCommunicator.doPost<
            TweeterRequest,
            UserItemCountResponse
        >(request, `/follower/count`);

        // Handle errors
        if (response.success) {
            if (response.count == null) {
                throw new Error(`No followers found`);
            } else {
                return response.count;
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async follow(request: TweeterRequest): Promise<[number, number]> {
        // Call the backend follow Lambda
        const response = await this.clientCommunicator.doPost<
            TweeterRequest,
            CombinedCountResponse
        >(request, "/follow");

        if (!response.success) {
            throw new Error(response.message ?? "Follow failed");
        }

        // Return updated counts
        return [response.followerCount, response.followeeCount];
    }

    public async unfollow(request: TweeterRequest): Promise<[number, number]> {
        const response = await this.clientCommunicator.doPost<
            TweeterRequest,
            CombinedCountResponse
        >(request, "/unfollow");

        if (!response.success) {
            throw new Error(response.message ?? "Unfollow failed");
        }

        return [response.followerCount, response.followeeCount];
    }

    public async getMoreStoryItems(
        request: PagedStatusItemRequest
    ): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedStatusItemRequest,
            PagedStatusItemResponse
        >(request, "/story/list");

        // Convert the StatusDto array returned by ClientCommunicator to a User array
        const items: Status[] | null =
            response.success && response.items
                ? response.items.map((dto) => Status.fromDto(dto) as Status)
                : null;

        // Handle errors
        if (response.success) {
            if (items == null) {
                throw new Error(`No stories found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async getMoreFeedItems(
        request: PagedStatusItemRequest
    ): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedStatusItemRequest,
            PagedStatusItemResponse
        >(request, "/feed/list");

        // Convert the StatusDto array returned by ClientCommunicator to a User array
        const items: Status[] | null =
            response.success && response.items
                ? response.items.map((dto) => Status.fromDto(dto) as Status)
                : null;

        // Handle errors
        if (response.success) {
            if (items == null) {
                throw new Error(`No feeds found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    public async postStatus(request: PostStatusRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<
            PostStatusRequest,
            TweeterResponse
        >(request, "/status/post");

        if (!response.success) {
            throw new Error(response.message ?? undefined);
        }
    }

    public async getIsFollowerStatus(
        request: IsFollowerStatusRequest
    ): Promise<boolean> {
        const response = await this.clientCommunicator.doPost<
            IsFollowerStatusRequest,
            IsFollowerStatusResponse
        >(request, "/status/isFollower");

        if (!response.success) {
            throw new Error(response.message ?? undefined);
        }

        return response.isFollower;
    }

    public async getUser(request: TweeterRequest): Promise<User | null> {
        const response = await this.clientCommunicator.doPost<
            TweeterRequest,
            GetUserResponse
        >(request, "/user/get");

        if (!response.success) {
            throw new Error(response.message ?? undefined);
        }

        const user = User.fromDto(response.user);

        return user;
    }

    public async login(request: LoginRequest): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<
            LoginRequest,
            AuthorizationResponse
        >(request, "/user/login");

        if (!response.success) {
            throw new Error(response.message ?? undefined);
        }

        const user = User.fromDto(response.user);
        const authToken = AuthToken.fromDto(response.authToken);

        return [user!, authToken!];
    }

    public async register(
        request: RegisterRequest
    ): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<
            RegisterRequest,
            AuthorizationResponse
        >(request, "/user/register");

        if (!response.success) {
            throw new Error(response.message ?? undefined);
        }

        const user = User.fromDto(response.user);
        const authToken = AuthToken.fromDto(response.authToken);

        return [user!, authToken!];
    }

    public async logout(request: TweeterRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<
            TweeterRequest,
            TweeterResponse
        >(request, "/user/logout");

        if (!response.success) {
            throw new Error(response.message ?? undefined);
        }
    }
}
