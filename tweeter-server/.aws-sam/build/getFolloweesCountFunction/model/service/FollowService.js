"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    async getFakeDataUsers(lastItem, pageSize, userAlias) {
        const [items, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfUsers(tweeter_shared_1.User.fromDto(lastItem), pageSize, userAlias);
        const dtos = items.map((user) => user.dto);
        return [dtos, hasMore];
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling server
        return this.getFakeDataUsers(lastItem, pageSize, userAlias);
    }
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling server
        return this.getFakeDataUsers(lastItem, pageSize, userAlias);
    }
    async getFolloweeCount(token, alias) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.getFolloweeCount(alias);
    }
    async getFollowerCount(token, alias) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.getFollowerCount(alias);
    }
    async follow(authToken, userToFollowAlias) {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server
        const followerCount = await this.getFollowerCount(authToken, userToFollowAlias);
        const followeeCount = await this.getFolloweeCount(authToken, userToFollowAlias);
        return [followerCount, followeeCount];
    }
    async unfollow(authToken, userToUnfollowAlias) {
        // Pause so we can see the unfollow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server
        const followerCount = await this.getFollowerCount(authToken, userToUnfollowAlias);
        const followeeCount = await this.getFolloweeCount(authToken, userToUnfollowAlias);
        return [followerCount, followeeCount];
    }
}
exports.FollowService = FollowService;
