import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3DAO } from "./interfaces/S3DAO";
import crypto from "crypto";

export class S3ProfileDAO implements S3DAO {
    private client = new S3Client({ region: process.env.AWS_REGION });
    private bucket = "tweeter-profile-images-batfat00";

    public async uploadProfileImage(
        userAlias: string,
        imageStringBase64Encoded: string,
        fileExtension: string // "png" or "jpg"
    ): Promise<string> {
        // Generate a unique filename
        const fileName = `${userAlias}_${crypto.randomUUID()}.${fileExtension.toLowerCase()}`;

        // Decode Base64
        const decodedImageBuffer = Buffer.from(
            imageStringBase64Encoded,
            "base64"
        );

        // Determine MIME type
        const contentType =
            fileExtension.toLowerCase() === "png" ? "image/png" : "image/jpeg";

        const s3Params = {
            Bucket: this.bucket,
            Key: `image/${fileName}`,
            Body: decodedImageBuffer,
            ContentType: contentType,
            ObjectCannedACL: "public-read", // Makes the image publicly accessible
        };

        try {
            await this.client.send(new PutObjectCommand(s3Params));
            console.log("Image uploaded successfully to S3:", fileName);
            return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/image/${fileName}`;
        } catch (error) {
            throw new Error("S3 put image failed with: " + error);
        }
    }
}
