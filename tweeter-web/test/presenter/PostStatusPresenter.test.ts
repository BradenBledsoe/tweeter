import { AuthToken, Status } from "tweeter-shared";
import {
    PostStatusView,
    PostStatusPresenter,
} from "../../src/presenter/PostStatusPresenter";
import {
    anything,
    capture,
    instance,
    mock,
    spy,
    verify,
    when,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model.service/StatusService";

describe("AppNavbarPresenter", () => {
    let mockPostStatusPresenterView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockService: StatusService;

    const authToken = new AuthToken("abc123", Date.now());
    const postContent = "This is a test post";

    beforeEach(() => {
        mockPostStatusPresenterView = mock<PostStatusView>();
        const mockPostStatusPresenterViewInstance = instance(
            mockPostStatusPresenterView
        );
        when(
            mockPostStatusPresenterView.displayInfoMessage(anything(), 0)
        ).thenReturn("messageId456");

        const postStatusPresenterSpy = spy(
            new PostStatusPresenter(mockPostStatusPresenterViewInstance)
        );
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockService = mock<StatusService>();
        when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
    });

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(
            postContent,
            authToken,
            anything()
        );
        verify(
            mockPostStatusPresenterView.displayInfoMessage(
                "Posting status...",
                0
            )
        ).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token", async () => {
        await postStatusPresenter.submitPost(
            postContent,
            authToken,
            anything()
        );
        verify(mockService.postStatus(authToken, anything())).once();

        let [capturedAuthToken, capturedStatus] = capture(
            mockService.postStatus
        ).last();
        expect(capturedAuthToken).toEqual(authToken);
        expect(capturedStatus.post).toEqual(postContent);
    });

    it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
        await postStatusPresenter.submitPost(
            postContent,
            authToken,
            anything()
        );

        verify(
            mockPostStatusPresenterView.deleteMessage("messageId456")
        ).once();
        verify(mockPostStatusPresenterView.clearPostInput()).once();
        verify(
            mockPostStatusPresenterView.displayInfoMessage(
                "Status posted!",
                2000
            )
        ).once();

        verify(
            mockPostStatusPresenterView.displayErrorMessage(anything())
        ).never();
    });

    it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
        let error = new Error("An error occurred");
        when(mockService.postStatus(authToken, anything())).thenThrow(error);

        await postStatusPresenter.submitPost(
            postContent,
            authToken,
            anything()
        );

        verify(mockPostStatusPresenterView.deleteMessage(anything())).once();
        verify(
            mockPostStatusPresenterView.displayErrorMessage(
                `Failed to post the status because of exception: An error occurred`
            )
        ).once();

        verify(mockPostStatusPresenterView.clearPostInput()).never();
        verify(
            mockPostStatusPresenterView.displayInfoMessage(
                "Status posted!",
                2000
            )
        ).never();
    });
});
