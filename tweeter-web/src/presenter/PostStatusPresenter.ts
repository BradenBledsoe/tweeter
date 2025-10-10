import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (
        message: string,
        duration: number,
        bootstrapClasses?: string | undefined
    ) => string;
    deleteMessage: (messageId: string) => void;
    clearPostInput: () => void;
    setIsLoading: (isLoading: boolean) => void;
}

export class PostStatusPresenter {
    private service: StatusService;
    private _view: PostStatusView;

    public constructor(view: PostStatusView) {
        this._view = view;
        this.service = new StatusService();
    }

    public async submitPost(
        post: string,
        authToken: AuthToken,
        currentUser: User
    ) {
        var postingStatusToastId = "";

        try {
            this._view.setIsLoading(true);
            postingStatusToastId = this._view.displayInfoMessage(
                "Posting status...",
                0
            );

            const status = new Status(post, currentUser, Date.now());

            await this.service.postStatus(authToken, status);

            this._view.clearPostInput();
            this._view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to post the status because of exception: ${error}`
            );
        } finally {
            this._view.deleteMessage(postingStatusToastId);
            this._view.setIsLoading(false);
        }
    }

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void> {
        return this.service.postStatus(authToken, newStatus);
    }
}
