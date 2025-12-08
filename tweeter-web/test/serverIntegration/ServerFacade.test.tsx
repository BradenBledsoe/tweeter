import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade";
import { User, AuthToken } from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
    let serverFacade: ServerFacade;

    beforeAll(() => {
        serverFacade = new ServerFacade();
    });

    describe("Register", () => {
        it("should successfully register a new user", async () => {
            const firstName = "Test";
            const lastName = "User";
            const alias = "@testuser" + Date.now();
            const password = "password123";
            const imageStringBase64 =
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
            const imageFileExtension = "jpg";

            const [user, token] = await serverFacade.register(
                firstName,
                lastName,
                alias,
                password,
                imageStringBase64,
                imageFileExtension
            );

            expect(user).toBeDefined();
            expect(user).toBeInstanceOf(User);
            expect(user.firstName).toBeDefined();
            expect(user.lastName).toBeDefined();
            expect(user.alias).toBeDefined();
            expect(user.imageUrl).toBeDefined();

            expect(token).toBeDefined();
            expect(typeof token).toBe("string");
            expect(token.length).toBeGreaterThan(0);
        }, 10000);
    });

    describe("GetFollowers", () => {
        it("should successfully get followers", async () => {
            const authToken = "test-token";
            const userAlias = "@allen";
            const pageSize = 10;
            const lastItem = null;

            const [followers, hasMore] = await serverFacade.getMoreFollowers(
                authToken,
                userAlias,
                pageSize,
                lastItem
            );

            expect(followers).toBeDefined();
            expect(Array.isArray(followers)).toBe(true);
            expect(followers.length).toBeGreaterThan(0);
            expect(followers.length).toBeLessThanOrEqual(pageSize);

            followers.forEach((follower) => {
                expect(follower).toBeInstanceOf(User);
                expect(follower.firstName).toBeDefined();
                expect(follower.lastName).toBeDefined();
                expect(follower.alias).toBeDefined();
                expect(follower.imageUrl).toBeDefined();
            });

            expect(typeof hasMore).toBe("boolean");
        }, 10000);
    });

    describe("GetFollowersCount", () => {
        it("should successfully get followers count", async () => {
            const authToken = "test-token";
            const user = new User("Test", "User", "@allen", "test-image-url");

            const followersCount = await serverFacade.getFollowerCount(
                authToken,
                user
            );

            expect(followersCount).toBeDefined();
            expect(typeof followersCount).toBe("number");
            expect(followersCount).toBeGreaterThanOrEqual(0);
        }, 10000);
    });

    describe("GetFollowingCount", () => {
        it("should successfully get following count", async () => {
            const authToken = "test-token";
            const user = new User("Test", "User", "@allen", "test-image-url");

            const followingCount = await serverFacade.getFolloweeCount(
                authToken,
                user
            );

            expect(followingCount).toBeDefined();
            expect(typeof followingCount).toBe("number");
            expect(followingCount).toBeGreaterThanOrEqual(0);
        }, 10000);
    });
});
