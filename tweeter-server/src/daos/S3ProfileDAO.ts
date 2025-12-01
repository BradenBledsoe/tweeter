import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3DAO } from "./interfaces/S3DAO";

export class S3ProfileDAO implements S3DAO {
    private readonly client = new S3Client({});
    private readonly bucket = "tweeter-profile-images-batfat00";

    public async uploadProfileImage(
        alias: string,
        base64: string,
        extension: string
    ): Promise<string> {
        const buffer = Buffer.from(base64, "base64");
        const key = `profiles/${alias}.${extension}`;
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: `image/${extension}`,
            })
        );
        return `https://${this.bucket}.s3.amazonaws.com/${key}`;
    }
}
