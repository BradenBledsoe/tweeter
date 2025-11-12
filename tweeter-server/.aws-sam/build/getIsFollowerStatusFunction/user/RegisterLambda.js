"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../model/service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const [user, authToken] = await userService.register(request.firstName, request.lastName, request.userAlias, request.password, request.userImageBytes, request.imageFileExtension);
    return {
        success: true,
        message: null,
        user: user,
        authToken: authToken,
    };
};
exports.handler = handler;
