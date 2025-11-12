"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
const handler = async (request) => {
    const followService = new FollowService_1.FollowService();
    const count = await followService.getFolloweeCount(request.token, request.userAlias);
    return {
        success: true,
        message: null,
        count: count,
    };
};
exports.handler = handler;
