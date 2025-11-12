"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    async getUser(token, alias) {
        // TODO: Replace with the result of calling server
        return tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
    }
    async login(alias, password) {
        // TODO: Replace with the result of calling the server
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        const authToken = tweeter_shared_1.FakeData.instance.authToken;
        return [user.dto, authToken.dto];
    }
    async register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        // TODO: Replace with the result of calling the server
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("Invalid registration");
        }
        const authToken = tweeter_shared_1.FakeData.instance.authToken;
        return [user.dto, authToken.dto];
    }
    async logout(token) {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        //await new Promise((res) => setTimeout(res, 1000));
    }
}
exports.UserService = UserService;
