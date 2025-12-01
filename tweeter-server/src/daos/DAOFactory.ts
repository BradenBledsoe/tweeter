// daos/DAOFactory.ts
import { UserDAO } from "./interfaces/UserDAO";
import { FollowDAO } from "./interfaces/FollowDAO";
import { StatusDAO } from "./interfaces/StatusDAO";
import { AuthTokenDAO } from "./interfaces/AuthTokenDAO";
import { S3DAO } from "./interfaces/S3DAO";
import { FeedDAO } from "./interfaces/FeedDAO";

export interface DAOFactory {
    createUserDAO(): UserDAO;
    createFollowDAO(): FollowDAO;
    createStatusDAO(): StatusDAO;
    createFeedDAO(): FeedDAO;
    createAuthTokenDAO(): AuthTokenDAO;
    createS3DAO(): S3DAO;
}
