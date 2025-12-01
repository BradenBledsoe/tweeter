export interface S3DAO {
    uploadProfileImage(
        alias: string,
        base64: string,
        extension: string
    ): Promise<string>;
}
