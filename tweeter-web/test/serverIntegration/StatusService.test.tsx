import {
    AuthToken,
    PagedStatusItemRequest,
    Status,
    User,
} from "tweeter-shared";
import "isomorphic-fetch";
import "@testing-library/jest-dom";
import { StatusService } from "../../src/model.service/StatusService";
import { ServerFacade } from "../../src/network/ServerFacade";

describe("StatusService Integration Tests", () => {
    let service: StatusService;
    let authToken: AuthToken;
    let user: User;

    beforeAll(async () => {
        const server = new ServerFacade();

        [user, authToken] = await server.login({
            userAlias: "@allen",
            password: "password",
        });

        service = new StatusService();
    });

    test("loadMoreStoryItems - should retrieve a page of story items successfully", async () => {
        const request: PagedStatusItemRequest = {
            token: authToken.token,
            userAlias: user.alias,
            pageSize: 5,
            lastItem: null,
        };

        const [statuses, hasMore] = await service.loadMoreStoryItems(request);

        expect(Array.isArray(statuses)).toBe(true);
        expect(typeof hasMore).toBe("boolean");

        if (statuses.length > 0) {
            const first = statuses[0];
            expect(first).toBeInstanceOf(Status);
            expect(typeof first.post).toBe("string");
            expect(first.user).toBeDefined();
            expect(typeof first.user.alias).toBe("string");
        }

        expect(statuses.length).toBe(5);

        console.log(
            "Retrieved",
            statuses.length,
            "statuses. More pages?",
            hasMore
        );
    });
});
