import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify, when } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { userInfoList } from "../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
    ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
    __esModule: true,
    userInfoList: jest.fn(),
}));

describe("Post Status Component", () => {
    // mock data
    const mockUser = mock(User);
    // Optionally stub methods
    when(mockUser.name).thenReturn("Test User");

    const mockUserInstance = instance(mockUser);
    // Mock AuthToken
    const mockAuthToken = mock(AuthToken);
    // Optionally stub methods
    when(mockAuthToken.token).thenReturn("fake-token");

    const mockAuthTokenInstance = instance(mockAuthToken);

    beforeAll(() => {
        (userInfoList as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
        });
    });

    it("starts with the sign in button disabled", () => {
        const { postStatusButton, clearStatusButton } =
            renderPostStatusAndGetElement();
        expect(postStatusButton).toBeDisabled();
        expect(clearStatusButton).toBeDisabled();
    });

    it("enables the post status and clear status buttons if the text field has text", async () => {
        const {
            postStatusTextArea,
            postStatusButton,
            clearStatusButton,
            user,
        } = renderPostStatusAndGetElement();

        await fillFields(
            postStatusTextArea,
            postStatusButton,
            clearStatusButton,
            user
        );
    });

    it("disables the post status and clear status buttons if the text field does not has text", async () => {
        const {
            postStatusTextArea,
            postStatusButton,
            clearStatusButton,
            user,
        } = renderPostStatusAndGetElement();

        await fillFields(
            postStatusTextArea,
            postStatusButton,
            clearStatusButton,
            user
        );

        await user.clear(postStatusTextArea);
        expect(postStatusButton).toBeDisabled();
        expect(clearStatusButton).toBeDisabled();
    });

    it("calls the presenter's submit post method with correct parameters when the post status button is pressed", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const postMessage = "This is a test post!";

        const { postStatusTextArea, postStatusButton, user } =
            renderPostStatusAndGetElement(mockPresenterInstance);

        await user.type(postStatusTextArea, postMessage);
        await user.click(postStatusButton);

        verify(
            mockPresenter.submitPost(
                postMessage,
                mockAuthTokenInstance,
                mockUserInstance
            )
        ).once();
    });
});

async function fillFields(
    postStatusTextArea: HTMLElement,
    postStatusButton: HTMLElement,
    clearStatusButton: HTMLElement,
    user: ReturnType<typeof userEvent.setup>
) {
    await user.type(postStatusTextArea, "a");
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
}

function renderPostStatus(presenter?: PostStatusPresenter) {
    return render(
        presenter ? <PostStatus presenter={presenter} /> : <PostStatus />
    );
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
    const user = userEvent.setup();

    renderPostStatus(presenter);

    const postStatusButton = screen.getByLabelText("postStatus");
    const clearStatusButton = screen.getByLabelText("clearStatus");
    const postStatusTextArea = screen.getByLabelText("postStatusTextArea");

    return { user, postStatusButton, clearStatusButton, postStatusTextArea };
}
