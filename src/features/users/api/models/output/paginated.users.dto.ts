import {User} from "../../../domain/users.entity";

export class PaginatedUsersDto {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: User[];
}