"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
const handler = async (request) => {
    const followService = new FollowService_1.FollowService();
    const [followerCount, followeeCount] = await followService.follow(request.token, request.userAlias);
    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount,
    };
};
exports.handler = handler;
