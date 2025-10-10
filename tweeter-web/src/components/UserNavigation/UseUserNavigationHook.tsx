import { useMessageActions } from "../toaster/MessageHooks";
import { useNavigate } from "react-router-dom";
import { userInfoActions, userInfoList } from "../userInfo/UserInfoHooks";
import {
    UserNavigationHookPresenter,
    UserNavigationHookView,
} from "../../presenter/UserNavigationHookPresenter";

export const useUserNavigation = () => {
    const { displayErrorMessage } = useMessageActions();
    const { displayedUser, authToken } = userInfoList();
    const { setDisplayedUser } = userInfoActions();

    const navigate = useNavigate();

    const listener: UserNavigationHookView = {
        displayErrorMessage: displayErrorMessage,
        setDisplayedUser: setDisplayedUser,
        navigate: navigate,
    };

    const presenter = new UserNavigationHookPresenter(listener);

    const navigateToUser = async (
        event: React.MouseEvent,
        featurePath: string
    ): Promise<void> => {
        await presenter.navigateToUser(
            event,
            featurePath,
            authToken!,
            displayedUser!
        );
    };

    return { navigateToUser };
};
