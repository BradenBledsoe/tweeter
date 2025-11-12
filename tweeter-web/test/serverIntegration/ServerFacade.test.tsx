import "isomorphic-fetch";
import "@testing-library/jest-dom";
import { ServerFacade } from "../../src/network/ServerFacade";
import {
    TweeterRequest,
    PagedUserItemRequest,
    AuthToken,
    User,
} from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
    let serverFacade: ServerFacade;
    let authToken: AuthToken;
    let user: User;
    beforeEach(async () => {
        serverFacade = new ServerFacade();

        // Create a unique alias for each run (to avoid duplicate errors)
        const alias = `@jestUser${Date.now()}`;

        // Try register
        const [registeredUser, token] = await serverFacade.register({
            userAlias: "@jestUser",
            firstName: "Jest",
            lastName: "User",
            password: "password123",
            userImageBytes: "efwslnf32",
            imageFileExtension: "yes/hello",
        });

        user = registeredUser;
        authToken = token;
    });

    test("Register - should register a new user successfully", async () => {
        expect(user).toBeDefined();
        expect(typeof user.firstName).toBe("string");
        expect(typeof user.lastName).toBe("string");
        expect(typeof user.alias).toBe("string");
        expect(authToken).toBeDefined();
        expect(typeof authToken.token).toBe("string");
    });

    test("GetFollowers - should return a list of followers", async () => {
        const request: PagedUserItemRequest = {
            token: authToken.token,
            userAlias: user.alias,
            pageSize: 10,
            lastItem: null, // no last item
        };

        const [followers, hasMore] = await serverFacade.getMoreFollowers(
            request
        );

        expect(Array.isArray(followers)).toBe(true);
        expect(typeof hasMore).toBe("boolean");
    });

    test("GetFollowerCount - should return a numeric count", async () => {
        const request: TweeterRequest = {
            token: authToken.token,
            userAlias: user.alias,
        };
        const count = await serverFacade.getFollowerCount(request);

        expect(typeof count).toBe("number");
        expect(count).toBeGreaterThanOrEqual(0);
    });
});
