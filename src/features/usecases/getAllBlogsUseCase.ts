import {Injectable} from "@nestjs/common";
import {BlogsQueryRepository} from "../blogs/infrastructure/blogs.query-repository";
import {SortBlogsDto} from "../blogs/api/models/input/sort-blog.input.dto";
import {BlogOutputModelMapper} from "../blogs/api/models/output/blog.output.model";

@Injectable()
export class GetAllBlogsUseCase {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {
    }

    async execute(sortData: SortBlogsDto) {
        const sortBy = sortData.sortBy ?? 'createdAt';
        const sortDirection = sortData.sortDirection ?? 'desc';
        const pageNumber = sortData.pageNumber ?? 1;
        const pageSize = sortData.pageSize ?? 10;
        const searchNameTerm = sortData.searchNameTerm ?? null;


        let filter: any = {};

        if (searchNameTerm) {
            filter['$or'] = [{
                'name': {
                    $regex: searchNameTerm,
                    $options: 'i' // case-insensitive search
                }
            }];
        }

        if (!filter['$or']?.length) {
            filter = {};
        }

        const blogs = await this.blogsQueryRepository
            .findAllBlogsByFilter(filter, sortBy, sortDirection, (pageNumber - 1) * pageSize, pageSize);
        const totalCount = await this.blogsQueryRepository.countDocuments(filter);
        const pageCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: blogs.map(BlogOutputModelMapper),
        }

    }
}