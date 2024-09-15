import {Injectable} from "@nestjs/common";
import {BlogsQueryRepository} from "../blogs/infrastructure/blogs.query-repository";
import {SortBlogsDto} from "../blogs/api/models/input/sort-blog.input.dto";
import {BlogsRepository} from "../blogs/infrastructure/blogs.repository";


@Injectable()
export class DeleteBlogByIdUseCase {
    constructor(private blogsRepository: BlogsRepository) {
    }

    async execute(blogId) {
        return await this.blogsRepository.deleteById(blogId);
    }

}