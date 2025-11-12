"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../model/service/StatusService");
const handler = async (request) => {
    const statusService = new StatusService_1.StatusService();
    const isFollower = await statusService.getIsFollowerStatus(request.token, request.user, request.selectedUser);
    return {
        success: true,
        message: null,
        isFollower: isFollower,
    };
};
exports.handler = handler;
