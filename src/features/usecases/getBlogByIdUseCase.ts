import {Injectable, NotFoundException} from "@nestjs/common";
import {BlogsRepository} from "../blogs/infrastructure/blogs.repository";
import {Blog} from "../blogs/domain/blog.entity";
import {BlogOutputModel, BlogOutputModelMapper} from "../blogs/api/models/output/blog.output.model";
import {BlogsQueryRepository} from "../blogs/infrastructure/blogs.query-repository";

@Injectable()
export class GetBlogByIdUseCase {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {
    }

    async execute(blogId: any): Promise<BlogOutputModel | null> {

        const blog = await this.blogsQueryRepository.getBlogById(blogId);

        if (blog === null) {
            throw new NotFoundException(`Blog not found`);
        }

        return blog;
    }
}