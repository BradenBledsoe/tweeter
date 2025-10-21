import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";

library.add(fab);

describe("Login Component", () => {
    it("starts with the sign in button disabled", () => {
        const { signInButton } = renderLoginAndGetElement("/");
        expect(signInButton).toBeDisabled();
    });

    it("enables the sign in button if both alias and password fields have text", async () => {
        const { signInButton, aliasField, passwordField, user } =
            renderLoginAndGetElement("/");

        await fillFields(signInButton, aliasField, passwordField, user);
    });

    it("disables the sign in button if either the alias and the password field is cleared", async () => {
        const { signInButton, aliasField, passwordField, user } =
            renderLoginAndGetElement("/");

        await fillFields(signInButton, aliasField, passwordField, user);

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();

        await user.type(aliasField, "a");
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    });

    it("calls the presenter's login method with correct parameters when the sign in button is pressed", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const originalUrl = "htpp://somewhere.com";
        const alias = "@alias";
        const password = "myPassword";
        const rememberMe = false;
        const { signInButton, aliasField, passwordField, user } =
            renderLoginAndGetElement(originalUrl, mockPresenterInstance);

        await user.type(aliasField, alias);
        await user.type(passwordField, password);
        await user.click(signInButton);

        verify(
            mockPresenter.doLogin(alias, password, originalUrl, rememberMe)
        ).once();
    });
});

async function fillFields(
    signInButton: HTMLElement,
    aliasField: HTMLElement,
    passwordField: HTMLElement,
    user: ReturnType<typeof userEvent.setup>
) {
    await user.type(aliasField, "a");
    await user.type(passwordField, "b");
    expect(signInButton).toBeEnabled();
}

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <Login originalUrl={originalUrl} presenter={presenter} />
            ) : (
                <Login originalUrl={originalUrl} />
            )}
        </MemoryRouter>
    );
}

function renderLoginAndGetElement(
    originalUrl: string,
    presenter?: LoginPresenter
) {
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole("button", { name: /sign in/i });
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return { user, signInButton, aliasField, passwordField };
}
