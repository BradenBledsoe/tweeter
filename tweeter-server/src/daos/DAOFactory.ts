// daos/DAOFactory.ts
import { UserDAO } from "./interfaces/UserDAO";
import { FollowDAO } from "./interfaces/FollowDAO";
import { StatusDAO } from "./interfaces/StatusDAO";
import { AuthTokenDAO } from "./interfaces/AuthTokenDAO";
import { S3DAO } from "./interfaces/S3DAO";

export interface DAOFactory {
    userDAO(): UserDAO;
    followDAO(): FollowDAO;
    statusDAO(): StatusDAO;
    authTokenDAO(): AuthTokenDAO;
    s3DAO(): S3DAO;
}
