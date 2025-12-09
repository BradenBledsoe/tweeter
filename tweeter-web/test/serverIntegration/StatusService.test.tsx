import { StatusService } from "../../src/model.service/StatusService";
import { ServerFacade } from "../../src/network/ServerFacade";
import { User, AuthToken, Status } from "tweeter-shared";
import "isomorphic-fetch";

describe("StatusService Integration Tests", () => {
    let service: StatusService;
    let authToken: AuthToken;
    let user: User;

    beforeAll(async () => {
        const server = new ServerFacade();

        // Create a unique alias so each run registers a new user
        const alias = `@jestUser${Date.now()}`;

        // Register the user
        const [registeredUser, tokenString] = await server.register(
            "Test",
            "User",
            alias,
            "password123",
            "", // no image string
            "jpg" // extension placeholder
        );

        user = registeredUser;
        // Construct a real AuthToken instance from the token string
        authToken = new AuthToken(tokenString, Date.now());

        service = new StatusService();
    });

    test("loadMoreStoryItems - should retrieve a page of story items successfully", async () => {
        const [statuses, hasMore] = await service.loadMoreStoryItems(
            authToken,
            user.alias,
            5,
            null
        );

        expect(Array.isArray(statuses)).toBe(true);
        expect(typeof hasMore).toBe("boolean");
    });

    test("postStatus - should append a new status to the user's story", async () => {
        const newStatus = new Status("Hello from Jest!", user, Date.now());

        await service.postStatus(authToken, newStatus);

        const [storyItems] = await service.loadMoreStoryItems(
            authToken,
            user.alias,
            10,
            null
        );

        const found = storyItems.some(
            (status) =>
                status.post === newStatus.post &&
                status.user.alias === user.alias
        );

        expect(found).toBe(true);
    });
});
