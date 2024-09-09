// export class SortUserDto {
//     sortBy?: string;
//     sortDirection?: 'asc' | 'desc';
//     pageNumber?: number;
//     pageSize?: number;
//     searchLoginTerm?: string;
//     searchEmailTerm?: string;
// }

import {IsInt, IsOptional, IsString, Min} from "class-validator";

export class SortUserDto {
    // @IsOptional()
    // @IsString()
    readonly sortBy?: string;
    //
    // @IsOptional()
    // @IsString()
    readonly sortDirection?: 'asc' | 'desc';

    // @IsOptional()
    // @IsInt()
    // @Min(1)
    readonly pageNumber?: number;

    // @IsOptional()
    // @IsInt()
    // @Min(1)
    readonly pageSize?: number;

    // @IsOptional()
    // @IsString()
    readonly searchLoginTerm?: string;

    // @IsOptional()
    // @IsString()
    readonly searchEmailTerm?: string;
}