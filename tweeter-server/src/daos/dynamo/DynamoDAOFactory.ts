// src/daos/dynamo/DynamoDAOFactory.ts
import { DAOFactory } from "../DAOFactory";
import { DynamoUserDAO } from "./DynamoUserDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { UserDAO } from "../interfaces/UserDAO";
import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import { FollowDAO } from "../interfaces/FollowDAO";
import { S3DAO } from "../interfaces/S3DAO";
import { StatusDAO } from "../interfaces/StatusDAO";
import { FeedDAO } from "../interfaces/FeedDAO";
import { DynamoFeedDAO } from "./DynamoFeedDAO";
import { S3ProfileDAO } from "../S3ProfileDAO";

export class DynamoDAOFactory implements DAOFactory {
    createUserDAO(): UserDAO {
        return new DynamoUserDAO();
    }

    createFollowDAO(): FollowDAO {
        return new DynamoFollowDAO();
    }

    createStatusDAO(): StatusDAO {
        return new DynamoStatusDAO();
    }

    createFeedDAO(): FeedDAO {
        return new DynamoFeedDAO();
    }

    createAuthTokenDAO(): AuthTokenDAO {
        return new DynamoAuthTokenDAO();
    }

    createS3DAO(): S3DAO {
        return new S3ProfileDAO();
    }
}
