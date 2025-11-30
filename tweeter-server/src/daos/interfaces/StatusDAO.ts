import { StatusDto } from "tweeter-shared";

export interface StatusDAO {
    putStatus(userAlias: string, status: StatusDto): Promise<void>;
    listStory(
        userAlias: string,
        pageSize: number,
        lastKey?: string
    ): Promise<[StatusDto[], boolean]>;
    listFeed(
        userAlias: string,
        pageSize: number,
        lastKey?: string
    ): Promise<[StatusDto[], boolean]>;
    fanOutStatus(authorAlias: string, status: StatusDto): Promise<void>;
}
