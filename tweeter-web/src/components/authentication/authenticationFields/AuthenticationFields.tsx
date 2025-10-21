interface Props {
    onEnter: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onAliasChange: (val: string) => void;
    onPasswordChange: (val: string) => void;
}

const AuthenticationFields = (props: Props) => {
    return (
        <>
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    size={50}
                    id="aliasInput"
                    aria-label="alias"
                    placeholder="name@example.com"
                    onKeyDown={props.onEnter}
                    onChange={(event) =>
                        props.onAliasChange(event.target.value)
                    }
                />
                <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="password"
                    className="form-control bottom"
                    id="passwordInput"
                    aria-label="password"
                    placeholder="Password"
                    onKeyDown={props.onEnter}
                    onChange={(event) =>
                        props.onPasswordChange(event.target.value)
                    }
                />
                <label htmlFor="passwordInput">Password</label>
            </div>
        </>
    );
};

export default AuthenticationFields;
