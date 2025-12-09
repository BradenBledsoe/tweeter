import "isomorphic-fetch";
import { mock, instance, verify, anything } from "ts-mockito";
import { ServerFacade } from "../../src/network/ServerFacade";
import { AuthToken, Status, User } from "tweeter-shared";
import {
    PostStatusPresenter,
    PostStatusView,
} from "../../src/presenter/PostStatusPresenter";

describe("PostStatusPresenter Integration Test", () => {
    let serverFacade: ServerFacade;
    let user: User;
    let authToken: AuthToken;
    let viewMock: PostStatusView;
    let presenter: PostStatusPresenter;

    beforeAll(async () => {
        serverFacade = new ServerFacade();

        // Register a fresh user
        const alias = `@jestUser${Date.now()}`;
        const [newUser, token] = await serverFacade.register(
            "Test",
            "User",
            alias,
            "password123",
            "",
            "jpg"
        );

        user = newUser;
        authToken = new AuthToken(token, Date.now());

        // Create a mocked view
        viewMock = mock<PostStatusView>();
        presenter = new PostStatusPresenter(instance(viewMock));
    });

    it("should display 'Successfully Posted!' and append status to story", async () => {
        const newStatus = new Status("Hello from Jest!", user, Date.now());

        // Call through the presenter
        await presenter.submitPost(newStatus.post, authToken, user);

        // Verify the view was told to display the success message
        verify(viewMock.displayInfoMessage("Status posted!", 2000)).once();

        // Also verify the status is in the user's story
        const [storyItems] = await serverFacade.loadMoreStoryItems(
            authToken.token,
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
