// daos/s3/S3ProfileDAO.ts
import { S3DAO } from "../interfaces/S3DAO";
import {
    S3Client,
    PutObjectCommand,
    ObjectCannedACL,
} from "@aws-sdk/client-s3";

export class S3ProfileDAO implements S3DAO {
    constructor(
        private s3: S3Client,
        private bucket: string,
        private region: string
    ) {}

    async uploadProfileImage(
        alias: string,
        imageStringBase64Encoded: string,
        fileExtension: string
    ): Promise<string> {
        const decodedImageBuffer: Buffer = Buffer.from(
            imageStringBase64Encoded,
            "base64"
        );
        const key = `image/${alias}.${fileExtension}`;

        const s3Params = {
            Bucket: this.bucket,
            Key: key,
            Body: decodedImageBuffer,
            ContentType: `image/${fileExtension}`,
            ACL: ObjectCannedACL.public_read,
        };

        const command = new PutObjectCommand(s3Params);
        await this.s3.send(command);

        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }
}
