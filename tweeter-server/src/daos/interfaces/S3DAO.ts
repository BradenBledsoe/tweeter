export interface S3DAO {
    uploadProfileImage(
        alias: string,
        imageStringBase64Encoded: string,
        fileExtension: string
    ): Promise<string>;
}
