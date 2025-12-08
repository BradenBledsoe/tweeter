import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, NavigatingView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView, NavigatingView {
    setIsFollower: (isFollower: boolean) => void;
    setFolloweeCount: (count: number) => void;
    setFollowerCount: (count: number) => void;
    setIsLoading: (isLoading: boolean) => void;
    setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private followService: FollowService = new FollowService();

    public constructor(view: UserInfoView) {
        super(view);
    }

    private async doFollowingOperation(
        followingOperation: () => Promise<[number, number]>,
        errorOperationDescription: string,
        operationDescription: string,
        isFollowing: boolean
    ): Promise<void> {
        let userToast = "";
        try {
            this.view.setIsLoading(true);
            userToast = this.view.displayInfoMessage(operationDescription, 0);

            await this.doFailureReportingOperation(async () => {
                const [followerCount, followeeCount] =
                    await followingOperation();
                this.view.setIsFollower(isFollowing);
                this.view.setFollowerCount(followerCount);
                this.view.setFolloweeCount(followeeCount);
            }, errorOperationDescription);
        } finally {
            this.view.deleteMessage(userToast);
            this.view.setIsLoading(false);
        }
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(async () => {
            if (
                currentUser &&
                displayedUser &&
                currentUser.equals(displayedUser)
            ) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.followService.getIsFollowerStatus(
                        authToken!,
                        currentUser!,
                        displayedUser!
                    )
                );
            }
        }, "determine follower status");
    }

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        this.doFailureReportingOperation(async () => {
            this.view.setFolloweeCount(
                await this.followService.getFolloweeCount(
                    authToken,
                    displayedUser
                )
            );
        }, "get followees count");
    }

    public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
        this.doFailureReportingOperation(async () => {
            this.view.setFollowerCount(
                await this.followService.getFollowerCount(
                    authToken,
                    displayedUser
                )
            );
        }, "get followers count");
    }

    public switchToLoggedInUser(
        event: React.MouseEvent,
        currentUser: User,
        currentPath: string
    ): void {
        event.preventDefault();
        this.view.setDisplayedUser(currentUser);
        this.view.navigate(
            `${this.getBaseUrl(currentPath)}/${currentUser.alias}`
        );
    }

    private getBaseUrl(currentPath: string): string {
        const segments = currentPath.split("/@");
        return segments.length > 1 ? segments[0] : "/";
    }

    public async followDisplayedUser(
        event: React.MouseEvent,
        authToken: AuthToken,
        displayedUser: User
    ): Promise<void> {
        event.preventDefault();

        this.doFollowingOperation(
            async () => {
                return await this.followService.follow(
                    authToken!,
                    displayedUser!
                );
            },
            "follow user",
            "Following " + displayedUser!.name + "...",
            true
        );
    }

    public async unfollowDisplayedUser(
        event: React.MouseEvent,
        authToken: AuthToken,
        displayedUser: User
    ): Promise<void> {
        event.preventDefault();

        this.doFollowingOperation(
            async () => {
                return await this.followService.unfollow(
                    authToken!,
                    displayedUser!
                );
            },
            "unfollow user",
            "Unfollowing " + displayedUser!.name + "...",
            false
        );
    }
}
