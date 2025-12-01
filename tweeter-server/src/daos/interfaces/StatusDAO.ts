import { StatusDto } from "tweeter-shared";

export interface StatusDAO {
    putStatus(status: StatusDto): Promise<void>;
    getPageOfStatuses(
        authorAlias: string,
        pageSize: number,
        lastItem?: StatusDto | null
    ): Promise<[StatusDto[], boolean]>;
}
