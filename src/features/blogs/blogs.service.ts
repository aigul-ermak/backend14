import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Blog } from './blogs.schema';
import { BlogsRepository } from './blogs.repo';
import { UpdateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsRepository) {}

  async create(name: string, description: string, websiteUrl: string) {
    // const existingBlog = await this.blogsRepo.findByName(name);
    // if (existingBlog) {
    //   throw new BadRequestException(`Blog with name "${name}" already exists`);
    //   // throw new HttpException(`Blog with name "${name}" already exists`, 400);
    // }

    const blog = Blog.create(name, description, websiteUrl);
    const createdBlog = await this.blogsRepository.insert(blog);

    return await this.blogsRepository.findById(createdBlog.id);
  }

  async findAll(): Promise<Blog[]> {
    return this.blogsRepository.findAll();
  }

  async findById(id: string) {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }

  async deleteBlogById(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteById(id);
  }

  async findAllPaginated(
    searchTerm: string,
    sort: string,
    direction: 'asc' | 'desc',
    page: number,
    pageSize: number,
  ): Promise<{ blogs: any[]; totalCount: number }> {
    const { blogs, totalCount } = await this.blogsRepository.findAllPaginated(
      searchTerm,
      sort,
      direction,
      page,
      pageSize,
    );

    const mappedBlogs = blogs.map((blog) => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    }));

    return {
      blogs: mappedBlogs,
      totalCount,
    };
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const updatedBlog = await this.blogsRepository.update(id, updateBlogDto);
    if (!updatedBlog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return updatedBlog;
  }
}
