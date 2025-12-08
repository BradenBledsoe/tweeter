import {
    LoginRequest,
    AuthResponse,
    User,
    UserDto,
    Status,
    StatusDto,
    GetUserRequest,
    GetUserResponse,
    LogoutRequest,
    LogoutResponse,
    RegisterRequest,
    FollowActionResponse,
    FollowActionRequest,
    GetItemCountResponse,
    IsFollowerStatusRequest,
    IsFollowerStatusResponse,
    PostStatusRequest,
    PostStatusResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
    private SERVER_URL =
        "https://9ldwkjkt6g.execute-api.us-east-1.amazonaws.com/prod";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    /**
     * Helper functions
     */

    private handleResponse<
        T extends { success: boolean; message?: string | null }
    >(response: T, errorMessage: string): T {
        if (response.success) {
            return response;
        } else {
            throw new Error(response.message ?? errorMessage);
        }
    }

    handleUserDtoResponse<
        T extends {
            success: boolean;
            message?: string | null;
            user?: UserDto;
            token?: { token: string };
        }
    >(response: T): [User, string] {
        if (
            response.success &&
            response.user &&
            response.token &&
            typeof response.token.token === "string"
        ) {
            const user = User.fromDto(response.user);
            if (user) {
                return [user, response.token.token];
            } else {
                throw new Error("Failed to parse user data");
            }
        } else {
            throw new Error(response.message ?? "Login failed");
        }
    }

    // Generic method to get paged items (users or statuses)
    private async getPagedItems<T extends { dto: any }>(
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: T | null,
        endpoint: string,
        itemType: string,
        fromDto: (dto: any) => T | null
    ): Promise<[T[], boolean]> {
        const request = {
            token: authToken,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem ? lastItem.dto : null,
        };

        const response = await this.clientCommunicator.doPost<any, any>(
            request,
            endpoint
        );

        if (response.success) {
            const items: T[] | null =
                response.items
                    ?.map((dto: any) => fromDto(dto))
                    .filter((item: T | null): item is T => item !== null) ??
                null;

            if (items == null || items.length === 0) {
                return [[], false];
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message ?? undefined);
        }
    }

    /**
     * Follow Methods
     */

    public async follow(
        authToken: string,
        user: User
    ): Promise<[number, number]> {
        const request: FollowActionRequest = {
            token: authToken,
            user: user.dto,
        };

        const response = await this.clientCommunicator.doPost<
            FollowActionRequest,
            FollowActionResponse
        >(request, "/follow");

        this.handleResponse(response, "Follow action failed");
        return [response.followerCount, response.followeeCount];
    }

    public async unfollow(
        authToken: string,
        user: User
    ): Promise<[number, number]> {
        const request: FollowActionRequest = {
            token: authToken,
            user: user.dto,
        };

        const response = await this.clientCommunicator.doPost<
            FollowActionRequest,
            FollowActionResponse
        >(request, "/unfollow");

        this.handleResponse(response, "Unfollow action failed");
        return [response.followerCount, response.followeeCount];
    }

    public async getFolloweeCount(
        authToken: string,
        user: User
    ): Promise<number> {
        const request: FollowActionRequest = {
            token: authToken,
            user: user.dto,
        };

        const response = await this.clientCommunicator.doPost<
            FollowActionRequest,
            GetItemCountResponse
        >(request, "/followees/count");

        this.handleResponse(response, "Failed to get followee count");
        return response.count;
    }

    public async getFollowerCount(
        authToken: string,
        user: User
    ): Promise<number> {
        const request: FollowActionRequest = {
            token: authToken,
            user: user.dto,
        };

        const response = await this.clientCommunicator.doPost<
            FollowActionRequest,
            GetItemCountResponse
        >(request, "/followers/count");

        this.handleResponse(response, "Failed to get follower count");
        return response.count;
    }

    public async getMoreFollowees(
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        return this.getPagedItems<User>(
            authToken,
            userAlias,
            pageSize,
            lastItem,
            "/followees/get",
            "followees",
            (dto) => User.fromDto(dto)
        );
    }

    public async getMoreFollowers(
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        return this.getPagedItems<User>(
            authToken,
            userAlias,
            pageSize,
            lastItem,
            "/followers/get",
            "followers",
            (dto) => User.fromDto(dto)
        );
    }

    public async isFollower(
        authToken: string,
        user: User,
        selectedUser: User
    ): Promise<boolean> {
        const request: IsFollowerStatusRequest = {
            token: authToken,
            user: user.dto,
            selectedUser: selectedUser.dto,
        };

        const response = await this.clientCommunicator.doPost<
            IsFollowerStatusRequest,
            IsFollowerStatusResponse
        >(request, "/follow/status");

        this.handleResponse(response, "Failed to check follower status");
        return response.isFollower;
    }

    /**
     * Status Methods
     */

    public async loadMoreFeedItems(
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return this.getPagedItems<Status>(
            authToken,
            userAlias,
            pageSize,
            lastItem,
            "/feeditems/get",
            "feed items",
            (dto) => Status.fromDto(dto)
        );
    }

    public async loadMoreStoryItems(
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return this.getPagedItems<Status>(
            authToken,
            userAlias,
            pageSize,
            lastItem,
            "/storyitems/get",
            "story items",
            (dto) => Status.fromDto(dto)
        );
    }

    public async postStatus(
        authToken: string,
        newStatus: Status
    ): Promise<void> {
        const request: PostStatusRequest = {
            token: authToken,
            newStatus: newStatus.dto,
        };

        const response = await this.clientCommunicator.doPost<
            PostStatusRequest,
            PostStatusResponse
        >(request, "/status/post");

        this.handleResponse(response, "Failed to post status");
        return;
    }

    /**
     * User Methods
     */

    public async getUser(
        authToken: string,
        userAlias: string
    ): Promise<User | null> {
        const request: GetUserRequest = {
            token: authToken,
            userAlias: userAlias,
        };

        const response = await this.clientCommunicator.doPost<
            GetUserRequest,
            GetUserResponse
        >(request, "/user");

        const validResponse = this.handleResponse(
            response,
            "Failed to get user"
        );

        if (validResponse.user) {
            return User.fromDto(validResponse.user);
        } else {
            return null;
        }
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[User, string]> {
        const request: LoginRequest = {
            alias: alias,
            password: password,
        };

        const response = await this.clientCommunicator.doPost<
            LoginRequest,
            AuthResponse
        >(request, "/login");

        return this.handleUserDtoResponse(response);
    }

    public async logout(authToken: string): Promise<void> {
        const request: LogoutRequest = {
            token: authToken,
        };

        const response = await this.clientCommunicator.doPost<
            LogoutRequest,
            LogoutResponse
        >(request, "/logout");

        this.handleResponse(response, "Logout failed");
        return;
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageStringBase64: string,
        imageFileExtension: string
    ): Promise<[User, string]> {
        const request: RegisterRequest = {
            firstName: firstName,
            lastName: lastName,
            alias: alias,
            password: password,
            imageStringBase64: imageStringBase64,
            imageFileExtension: imageFileExtension,
        };

        const response = await this.clientCommunicator.doPost<
            RegisterRequest,
            AuthResponse
        >(request, "/register");

        return this.handleUserDtoResponse(response);
    }
}
