export interface S3DAO {
    uploadProfileImage(
        userAlias: string,
        imageStringBase64Encoded: string,
        fileExtension: string
    ): Promise<string>;
}
