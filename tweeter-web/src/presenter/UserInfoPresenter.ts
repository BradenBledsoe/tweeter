import { AuthToken, User } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";
import { StatusService } from "../model.service/StatusService";
import { FollowService } from "../model.service/FollowService";
import { Link, useLocation, useNavigate } from "react-router-dom";

export interface UserInfoView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (
        message: string,
        duration: number,
        bootstrapClasses?: string | undefined
    ) => string;
    deleteMessage: (messageId: string) => void;
    navigate: NavigateFunction;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsFollower: React.Dispatch<React.SetStateAction<boolean>>;
    setFolloweeCount: React.Dispatch<React.SetStateAction<number>>;
    setFollowerCount: React.Dispatch<React.SetStateAction<number>>;
    setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter {
    private statusService: StatusService;
    private followService: FollowService;
    private _view: UserInfoView;

    public constructor(view: UserInfoView) {
        this._view = view;
        this.statusService = new StatusService();
        this.followService = new FollowService();
    }

    public switchToLoggedInUser = (currentUser: User): void => {
        this._view.setDisplayedUser(currentUser!);
        this._view.navigate(`${this.getBaseUrl()}/${currentUser!.alias}`);
    };

    private getBaseUrl(): string {
        const segments = location.pathname.split("/@");
        return segments.length > 1 ? segments[0] : "/";
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        try {
            if (currentUser === displayedUser) {
                this._view.setIsFollower(false);
            } else {
                this._view.setIsFollower(
                    await this.statusService.getIsFollowerStatus(
                        authToken!,
                        currentUser!,
                        displayedUser!
                    )
                );
            }
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to determine follower status because of exception: ${error}`
            );
        }
    }

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        try {
            this._view.setFolloweeCount(
                await this.followService.getFolloweeCount(
                    authToken,
                    displayedUser
                )
            );
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to get followees count because of exception: ${error}`
            );
        }
    }

    public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
        try {
            this._view.setFollowerCount(
                await this.followService.getFollowerCount(
                    authToken,
                    displayedUser
                )
            );
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to get followers count because of exception: ${error}`
            );
        }
    }

    public async followDisplayedUser(
        authToken: AuthToken,
        user: User
    ): Promise<void> {
        var followingUserToast = "";

        try {
            this._view.setIsLoading(true);
            followingUserToast = this._view.displayInfoMessage(
                `Following ${user.name}...`,
                0
            );

            const [followerCount, followeeCount] =
                await this.followService.follow(authToken, user);

            this._view.setIsFollower(true);
            this._view.setFollowerCount(followerCount);
            this._view.setFolloweeCount(followeeCount);
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to follow user because of exception: ${error}`
            );
        } finally {
            this._view.deleteMessage(followingUserToast);
            this._view.setIsLoading(false);
        }
    }

    public async unfollowDisplayedUser(
        authToken: AuthToken,
        user: User
    ): Promise<void> {
        var unfollowingUserToast = "";

        try {
            this._view.setIsLoading(true);
            unfollowingUserToast = this._view.displayInfoMessage(
                `Unfollowing ${user.name}...`,
                0
            );

            const [followerCount, followeeCount] =
                await this.followService.unfollow(authToken, user);

            this._view.setIsFollower(false);
            this._view.setFollowerCount(followerCount);
            this._view.setFolloweeCount(followeeCount);
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to unfollow user because of exception: ${error}`
            );
        } finally {
            this._view.deleteMessage(unfollowingUserToast);
            this._view.setIsLoading(false);
        }
    }
}
