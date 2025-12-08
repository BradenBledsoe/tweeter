import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
    clearPostInput: () => void;
    setIsLoading: (isLoading: boolean) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private _service = new StatusService();

    public get service() {
        return this._service;
    }

    public async submitPost(
        post: string,
        authToken: AuthToken,
        currentUser: User
    ) {
        var postingStatusToastId = "";

        await this.doFailureReportingOperation(
            async () => {
                this.view.setIsLoading(true);
                postingStatusToastId = this.view.displayInfoMessage(
                    "Posting status...",
                    0
                );

                const status = new Status(post, currentUser, Date.now());

                await this.service.postStatus(authToken!, status);

                this.view.clearPostInput();
                this.view.displayInfoMessage("Status posted!", 2000);
            },
            "post the status",
            async () => {
                this.view.deleteMessage(postingStatusToastId);
                this.view.setIsLoading(false);
            }
        );
    }
}
