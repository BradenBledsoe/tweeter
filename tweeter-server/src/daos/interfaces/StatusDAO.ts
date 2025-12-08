import { StatusDto } from "tweeter-shared";

export interface StatusDAO {
    create(status: StatusDto): Promise<void>;
    getUserStory(
        authorAlias: string,
        lastTimestamp: number | null,
        limit: number
    ): Promise<[StatusDto[], boolean]>;
}
