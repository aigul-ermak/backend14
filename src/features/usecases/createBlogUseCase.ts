import {Injectable} from "@nestjs/common";
import {BlogsRepository} from "../blogs/infrastructure/blogs.repository";
import {Blog} from "../blogs/domain/blog.entity";
import {CreateBlogInputDto} from "../blogs/api/models/input/create-blog.input.dto";


@Injectable()
export class CreateBlogUseCase {
    constructor(private blogsRepository: BlogsRepository) {
    }

    async execute(createBlogDto: CreateBlogInputDto) {

        const blog = Blog.create(
            createBlogDto.name, createBlogDto.description, createBlogDto.websiteUrl);

        const createdBlog = await this.blogsRepository.insert(blog);

        return createdBlog.id;
    }
}
