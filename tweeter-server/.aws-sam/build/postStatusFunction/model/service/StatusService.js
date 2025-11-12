"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class StatusService {
    async getFakeDataStatuses(lastItem, pageSize) {
        const [items, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfStatuses(tweeter_shared_1.Status.fromDto(lastItem), pageSize);
        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
    }
    async loadMoreStoryItems(token, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling server
        return this.getFakeDataStatuses(lastItem, pageSize);
    }
    async loadMoreFeedItems(token, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling server
        return this.getFakeDataStatuses(lastItem, pageSize);
    }
    async postStatus(token, newStatus) {
        // Pause so we can see the logging out message. Remove when connected to the server
        //await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server to post the status
    }
    async getIsFollowerStatus(token, user, selectedUser) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.isFollower();
    }
}
exports.StatusService = StatusService;
