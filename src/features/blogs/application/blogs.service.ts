import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {Blog} from '../domain/blog.entity';
import {BlogsRepository} from '../infrastructure/blogs.repository';
import {UpdateBlogDto} from '../api/models/input/create-blog.input.dto';

@Injectable()
export class BlogsService {
    constructor(private blogsRepository: BlogsRepository) {
    }

    // async update(id: string, updateBlogDto: UpdateBlogDto) {
    //     const updatedBlog = await this.blogsRepository.update(id, updateBlogDto);
    //     if (!updatedBlog) {
    //         throw new NotFoundException(`Blog with ID ${id} not found`);
    //     }
    //     return updatedBlog;
    // }
}
