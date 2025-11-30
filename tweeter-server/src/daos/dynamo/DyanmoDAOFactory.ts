// src/daos/dynamo/DynamoDAOFactory.ts
import { DAOFactory } from "../DAOFactory";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoUserDAO } from "./DynamoUserDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { S3ProfileDAO } from "./S3ProfileDAO";
import { UserDAO } from "../interfaces/UserDAO";
import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import { FollowDAO } from "../interfaces/FollowDAO";
import { S3DAO } from "../interfaces/S3DAO";
import { StatusDAO } from "../interfaces/StatusDAO";

export class DynamoDAOFactory implements DAOFactory {
    constructor(
        private ddb: DynamoDBClient,
        private s3: S3Client,
        private tables: {
            users: string;
            tokens: string;
            followers: string;
            story: string;
            feed: string;
            statuses: string;
        },
        private bucket: string,
        private followeesIndexName: string, // NEW: pass the GSI name
        private region: string
    ) {}

    userDAO(): UserDAO {
        return new DynamoUserDAO(this.ddb, this.tables.users);
    }

    followDAO(): FollowDAO {
        return new DynamoFollowDAO(
            this.ddb,
            this.tables.followers,
            this.followeesIndexName
        );
    }

    statusDAO(): StatusDAO {
        return new DynamoStatusDAO(
            this.ddb,
            this.tables.story,
            this.tables.feed,
            this.tables.followers // followers table name
        );
    }

    authTokenDAO(): AuthTokenDAO {
        return new DynamoAuthTokenDAO(this.ddb, this.tables.tokens);
    }

    s3DAO(): S3DAO {
        return new S3ProfileDAO(this.s3, this.bucket, this.region);
    }
}
