import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import {
    AuthenticationPresenter,
    AuthenticationView,
} from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
    setImageUrl: React.Dispatch<React.SetStateAction<string>>;
    setImageBytes: React.Dispatch<React.SetStateAction<Uint8Array>>;
    setImageFileExtension: React.Dispatch<React.SetStateAction<string>>;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
    public handleImageFile = (file: File | undefined) => {
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                // Remove unnecessary file metadata from the start of the string.
                const imageStringBase64BufferContents =
                    imageStringBase64.split("base64,")[1];

                const bytes: Uint8Array = Buffer.from(
                    imageStringBase64BufferContents,
                    "base64"
                );

                this.view.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);

            // Set image file extension (and move to a separate method)
            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
                this.view.setImageFileExtension(fileExtension);
            }
        } else {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
        }
    };

    private getFileExtension = (file: File): string | undefined => {
        return file.name.split(".").pop();
    };

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        imageFileExtension: string,
        rememberMe: boolean
    ) {
        await this.doAuthenticationOperation(
            alias,
            password,
            rememberMe,
            undefined,
            firstName,
            lastName,
            imageBytes,
            imageFileExtension
        );
    }

    protected getPostAuthRedirectUrl(user: User): string {
        return `/feed/${user.alias}`;
    }

    protected itemDescription(): string {
        return "register user";
    }

    protected authenticateUser(
        alias: string,
        password: string,
        firstName?: string,
        lastName?: string,
        imageBytes?: Uint8Array,
        imageFileExtension?: string
    ): Promise<[User, AuthToken]> {
        return this.service.register(
            firstName!,
            lastName!,
            alias,
            password,
            imageBytes!,
            imageFileExtension!
        );
    }
}
