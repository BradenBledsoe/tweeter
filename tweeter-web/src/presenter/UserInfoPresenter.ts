import { AuthToken, TweeterRequest, User } from "tweeter-shared";
import { NavigateFunction } from "react-router-dom";
import { StatusService } from "../model.service/StatusService";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
    navigate: NavigateFunction;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsFollower: React.Dispatch<React.SetStateAction<boolean>>;
    setFolloweeCount: React.Dispatch<React.SetStateAction<number>>;
    setFollowerCount: React.Dispatch<React.SetStateAction<number>>;
    setDisplayedUser: (user: User) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private statusService: StatusService;
    private followService: FollowService;

    public constructor(view: UserInfoView) {
        super(view);
        this.statusService = new StatusService();
        this.followService = new FollowService();
    }

    public switchToLoggedInUser = (currentUser: User): void => {
        this.view.setDisplayedUser(currentUser!);
        this.view.navigate(`${this.getBaseUrl()}/${currentUser!.alias}`);
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
        await this.doFailureReportingOperation(async () => {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.statusService.getIsFollowerStatus({
                        token: authToken!.token,
                        user: currentUser!,
                        selectedUser: displayedUser!,
                    })
                );
            }
        }, "determine follower status");
    }

    private async updateFollowCount(
        authToken: AuthToken,
        displayedUser: User,
        getFollowCount: (request: TweeterRequest) => Promise<number>,
        setFollowCount: (count: number) => void,
        description: string
    ) {
        await this.doFailureReportingOperation(async () => {
            const count = await getFollowCount({
                token: authToken.token,
                userAlias: displayedUser.alias,
            });
            setFollowCount(count);
        }, description);
    }

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        await this.updateFollowCount(
            authToken,
            displayedUser,
            this.followService.getFolloweeCount.bind(this.followService),
            this.view.setFolloweeCount,
            "get followees count"
        );
    }

    public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
        await this.updateFollowCount(
            authToken,
            displayedUser,
            this.followService.getFollowerCount.bind(this.followService),
            this.view.setFollowerCount,
            "get followers count"
        );
    }

    private async modifyFollowStatus(
        authToken: AuthToken,
        user: User,
        action: "follow" | "unfollow"
    ) {
        let toastId = "";
        const isFollowing = action === "follow";
        const messageVerb = isFollowing ? "Following" : "Unfollowing";
        const serviceMethod = isFollowing
            ? this.followService.follow.bind(this.followService)
            : this.followService.unfollow.bind(this.followService);

        await this.doFailureReportingOperation(
            async () => {
                this.view.setIsLoading(true);
                toastId = this.view.displayInfoMessage(
                    `${messageVerb} ${user.name}...`,
                    0
                );

                const [followerCount, followeeCount] = await serviceMethod({
                    token: authToken.token,
                    userAlias: user.alias,
                });

                this.view.setIsFollower(isFollowing);
                this.view.setFollowerCount(followerCount);
                this.view.setFolloweeCount(followeeCount);
            },
            `${action} user`,
            async () => {
                this.view.deleteMessage(toastId);
                this.view.setIsLoading(false);
            }
        );
    }

    public async followDisplayedUser(authToken: AuthToken, user: User) {
        await this.modifyFollowStatus(authToken, user, "follow");
    }

    public async unfollowDisplayedUser(authToken: AuthToken, user: User) {
        await this.modifyFollowStatus(authToken, user, "unfollow");
    }
}
