import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../authenticationFields/AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { userInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginPresenter } from "../../../presenter/LoginPresenter";
import { AuthenticationView } from "../../../presenter/AuthenticationPresenter";

interface Props {
    originalUrl?: string;
    presenterFactory: (listener: AuthenticationView) => LoginPresenter;
}

const Login = (props: Props) => {
    const [alias, setAlias] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { updateUserInfo } = userInfoActions();
    const { displayErrorMessage } = useMessageActions();

    const listener: AuthenticationView = {
        displayErrorMessage: displayErrorMessage,
        navigate: navigate,
        setIsLoading: setIsLoading,
        updateUserInfo: updateUserInfo,
    };

    const presenterRef = useRef<LoginPresenter | null>(null);
    if (!presenterRef.current) {
        presenterRef.current = props.presenterFactory(listener);
    }

    const checkSubmitButtonStatus = (): boolean => {
        return !alias || !password;
    };

    const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key == "Enter" && !checkSubmitButtonStatus()) {
            doLogin();
        }
    };

    const doLogin = async () => {
        presenterRef.current?.doLogin(
            alias,
            password,
            props.originalUrl,
            rememberMe
        );
    };

    const inputFieldFactory = () => {
        return (
            <AuthenticationFields
                onEnter={loginOnEnter}
                onAliasChange={setAlias}
                onPasswordChange={setPassword}
            />
        );
    };

    const switchAuthenticationMethodFactory = () => {
        return (
            <div className="mb-3">
                Not registered? <Link to="/register">Register</Link>
            </div>
        );
    };

    return (
        <AuthenticationFormLayout
            headingText="Please Sign In"
            submitButtonLabel="Sign in"
            oAuthHeading="Sign in with:"
            inputFieldFactory={inputFieldFactory}
            switchAuthenticationMethodFactory={
                switchAuthenticationMethodFactory
            }
            setRememberMe={setRememberMe}
            submitButtonDisabled={checkSubmitButtonStatus}
            isLoading={isLoading}
            submit={doLogin}
        />
    );
};

export default Login;
