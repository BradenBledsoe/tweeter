import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDAOFactory } from "../daos/dynamo/DyanmoDAOFactory";
import { AuthorizationService } from "./auth/AuthorizationService";
const ddb = new DynamoDBClient({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: process.env.AWS_REGION });

const factory = new DynamoDAOFactory(
    ddb,
    s3,
    {
        users: process.env.USERS_TABLE!,
        tokens: process.env.TOKENS_TABLE!,
        followers: process.env.FOLLOWERS_TABLE!,
        story: process.env.STORY_TABLE!,
        feed: process.env.FEED_TABLE!,
        statuses: process.env.STATUSES_TABLE!, // only if you use unified table
    },
    process.env.PROFILE_BUCKET!,
    process.env.FOLLOWEES_INDEX!,
    process.env.AWS_REGION!
);

const auth = new AuthorizationService(factory.authTokenDAO());

export const bootstrap = { factory, auth };
