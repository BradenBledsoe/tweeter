import "./App.css";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import { userInfoList } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { LoginPresenter } from "./presenter/LoginPresenter";
import { RegisterPresenter, RegisterView } from "./presenter/RegisterPresenter";
import { ToasterPresenter, ToasterView } from "./presenter/ToasterPresenter";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import { AuthenticationView } from "./presenter/AuthenticationPresenter";

const App = () => {
    const { currentUser, authToken } = userInfoList();

    const isAuthenticated = (): boolean => {
        return !!currentUser && !!authToken;
    };

    return (
        <div>
            <Toaster
                position="top-right"
                presenterFactory={(view: ToasterView) =>
                    new ToasterPresenter(view)
                }
            />
            <BrowserRouter>
                {isAuthenticated() ? (
                    <AuthenticatedRoutes />
                ) : (
                    <UnauthenticatedRoutes />
                )}
            </BrowserRouter>
        </div>
    );
};

const AuthenticatedRoutes = () => {
    const { displayedUser } = userInfoList();

    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route
                    index
                    element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
                />
                <Route
                    path="feed/:displayedUser"
                    element={
                        <StatusItemScroller
                            key={`story-${displayedUser!.alias}`}
                            featureURL="/feed"
                            presenterFactory={(view: PagedItemView<Status>) =>
                                new FeedPresenter(view)
                            }
                        />
                    }
                />
                <Route
                    path="story/:displayedUser"
                    element={
                        <StatusItemScroller
                            key={`story-${displayedUser!.alias}`}
                            featureURL="/story"
                            presenterFactory={(view: PagedItemView<Status>) =>
                                new StoryPresenter(view)
                            }
                        />
                    }
                />
                <Route
                    path="followees/:displayedUser"
                    element={
                        <UserItemScroller
                            key={`followees-${displayedUser!.alias}`}
                            featureURL="/followees"
                            presenterFactory={(view: PagedItemView<User>) =>
                                new FolloweePresenter(view)
                            }
                        />
                    }
                />
                <Route
                    path="followers/:displayedUser"
                    element={
                        <UserItemScroller
                            key={`followers-${displayedUser!.alias}`}
                            featureURL="/followers"
                            presenterFactory={(view: PagedItemView<User>) =>
                                new FollowerPresenter(view)
                            }
                        />
                    }
                />
                <Route path="logout" element={<Navigate to="/login" />} />
                <Route
                    path="*"
                    element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
                />
            </Route>
        </Routes>
    );
};

const UnauthenticatedRoutes = () => {
    const location = useLocation();

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <Login
                        presenterFactory={(view: AuthenticationView) =>
                            new LoginPresenter(view)
                        }
                    />
                }
            />
            <Route
                path="/register"
                element={
                    <Register
                        presenterFactory={(view: RegisterView) =>
                            new RegisterPresenter(view)
                        }
                    />
                }
            />
            <Route
                path="*"
                element={
                    <Login
                        originalUrl={location.pathname}
                        presenterFactory={(view: AuthenticationView) =>
                            new LoginPresenter(view)
                        }
                    />
                }
            />
        </Routes>
    );
};

export default App;
