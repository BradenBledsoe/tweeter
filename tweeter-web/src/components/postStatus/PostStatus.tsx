import "./PostStatus.css";
import { useRef, useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { userInfoList } from "../userInfo/UserInfoHooks";
import {
    PostStatusPresenter,
    PostStatusView,
} from "../../presenter/PostStatusPresenter";

interface Props {
    presenter?: PostStatusPresenter;
}

const PostStatus = (props: Props) => {
    const { displayInfoMessage, displayErrorMessage, deleteMessage } =
        useMessageActions();

    const { currentUser, authToken } = userInfoList();
    const [post, setPost] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const listener: PostStatusView = {
        displayErrorMessage: displayErrorMessage,
        displayInfoMessage: displayInfoMessage,
        deleteMessage: deleteMessage,
        clearPostInput: () => setPost(""),
        setIsLoading: setIsLoading,
    };

    const presenterRef = useRef<PostStatusPresenter | null>(null);
    if (!presenterRef.current) {
        presenterRef.current =
            props.presenter ?? new PostStatusPresenter(listener);
    }

    const submitPost = async (event: React.MouseEvent) => {
        event.preventDefault();
        presenterRef.current?.submitPost(post, authToken!, currentUser!);
    };

    const clearPost = (event: React.MouseEvent) => {
        event.preventDefault();
        setPost("");
    };

    const checkButtonStatus: () => boolean = () => {
        return !post.trim() || !authToken || !currentUser;
    };

    return (
        <form>
            <div className="form-group mb-3">
                <textarea
                    className="form-control"
                    id="postStatusTextArea"
                    aria-label="postStatusTextArea"
                    rows={10}
                    placeholder="What's on your mind?"
                    value={post}
                    onChange={(event) => {
                        setPost(event.target.value);
                    }}
                />
            </div>
            <div className="form-group">
                <button
                    id="postStatusButton"
                    className="btn btn-md btn-primary me-1"
                    type="button"
                    aria-label="postStatus"
                    disabled={checkButtonStatus()}
                    style={{ width: "8em" }}
                    onClick={submitPost}
                >
                    {isLoading ? (
                        <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                        ></span>
                    ) : (
                        <div>Post Status</div>
                    )}
                </button>
                <button
                    id="clearStatusButton"
                    className="btn btn-md btn-secondary"
                    type="button"
                    aria-label="clearStatus"
                    disabled={checkButtonStatus()}
                    onClick={clearPost}
                >
                    Clear
                </button>
            </div>
        </form>
    );
};

export default PostStatus;
