import "isomorphic-fetch";
import { StatusService } from "../../src/model.service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

describe("StatusService Integration Tests", () => {
    let statusService: StatusService;
    let authToken: AuthToken;

    beforeAll(() => {
        statusService = new StatusService();
        authToken = new AuthToken("test-token-" + Date.now(), Date.now());
    });

    describe("LoadMoreStoryItems", () => {
        it("should successfully load user's story items", async () => {
            const userAlias = "@allen";
            const pageSize = 10;
            const lastItem = null;

            const [storyItems, hasMore] =
                await statusService.loadMoreStoryItems(
                    authToken,
                    userAlias,
                    pageSize,
                    lastItem
                );

            expect(storyItems).toBeDefined();
            expect(Array.isArray(storyItems)).toBe(true);
            expect(storyItems.length).toBeGreaterThan(0);
            expect(storyItems.length).toBeLessThanOrEqual(pageSize);

            storyItems.forEach((status) => {
                expect(status).toBeInstanceOf(Status);
                expect(status.post).toBeDefined();
                expect(typeof status.post).toBe("string");
                expect(status.user).toBeDefined();
                expect(status.user).toBeInstanceOf(User);
                expect(status.timestamp).toBeDefined();
                expect(typeof status.timestamp).toBe("number");

                expect(status.user.firstName).toBeDefined();
                expect(status.user.lastName).toBeDefined();
                expect(status.user.alias).toBeDefined();
                expect(status.user.imageUrl).toBeDefined();
            });

            expect(typeof hasMore).toBe("boolean");
        }, 10000);
    });
});
