import { TweeterRequest, PagedUserItemRequest, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service {
    private serverFacade = new ServerFacade();
    public async loadMoreFollowees(
        request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        return await this.serverFacade.getMoreFollowees(request);
    }

    public async loadMoreFollowers(
        request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        return await this.serverFacade.getMoreFollowers(request);
    }

    public async getFolloweeCount(request: TweeterRequest): Promise<number> {
        // TODO: Replace with the result of calling server
        return this.serverFacade.getFolloweeCount(request);
    }

    public async getFollowerCount(request: TweeterRequest): Promise<number> {
        // TODO: Replace with the result of calling server
        return this.serverFacade.getFollowerCount(request);
    }

    public async follow(
        request: TweeterRequest
    ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server
        return this.serverFacade.follow(request);

        // const followerCount = await this.getFollowerCount(request);
        // const followeeCount = await this.getFolloweeCount(request);

        // return [followerCount, followeeCount];
    }

    public async unfollow(
        request: TweeterRequest
    ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        //await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server
        return this.serverFacade.unfollow(request);

        // const followerCount = await this.getFollowerCount(request);
        // const followeeCount = await this.getFolloweeCount(request);

        // return [followerCount, followeeCount];
    }
}
