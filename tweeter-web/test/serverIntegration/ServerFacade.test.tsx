import "isomorphic-fetch";
import "@testing-library/jest-dom";
import { ServerFacade } from "../../src/network/ServerFacade";
import { User } from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
    let serverFacade: ServerFacade;
    let authToken: string;
    let user: User;

    beforeEach(async () => {
        serverFacade = new ServerFacade();

        // Create a unique alias for each run (to avoid duplicate errors)
        const alias = `@jestUser${Date.now()}`;

        // Register a new user
        const [registeredUser, token] = await serverFacade.register(
            "Jest",
            "User",
            alias,
            "password123",
            "", // no image string
            "jpg" // extension placeholder
        );

        user = registeredUser;
        authToken = token;
    });

    test("Register - should register a new user successfully", async () => {
        expect(user).toBeDefined();
        expect(typeof user.firstName).toBe("string");
        expect(typeof user.lastName).toBe("string");
        expect(typeof user.alias).toBe("string");
        expect(authToken).toBeDefined();
        expect(typeof authToken).toBe("string");
    });

    test("GetFollowers - should return a list of followers", async () => {
        const [followers, hasMore] = await serverFacade.getMoreFollowers(
            authToken,
            user.alias,
            10,
            null
        );

        expect(Array.isArray(followers)).toBe(true);
        expect(typeof hasMore).toBe("boolean");
    });

    test("GetFollowerCount - should return a numeric count", async () => {
        const count = await serverFacade.getFollowerCount(authToken, user);

        expect(typeof count).toBe("number");
        expect(count).toBeGreaterThanOrEqual(0);
    });
});
