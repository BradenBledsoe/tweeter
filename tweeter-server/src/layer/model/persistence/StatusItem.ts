// src/layer/model/persistence/StatusItem.ts
import { StatusDto } from "tweeter-shared";

export interface StatusItem extends StatusDto {
    userAlias: string; // required partition key for DynamoDB
}
