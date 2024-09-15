import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Post, PostDocument } from './posts.schema';
import { BlogDocument } from '../blogs/domain/blog.entity';
import { UpdatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async insert(post: Post) {
    const res = await this.postModel.insertMany(post);
    return res[0];
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findById(id: any) {
    return this.postModel.findById(id).exec();
  }

  async findAllPaginated(
    page: number,
    pageSize: number,
    sort: string,
    sortDirection: 'asc' | 'desc',
  ): Promise<{ posts: PostDocument[]; totalCount: number }> {
    const skip = (page - 1) * pageSize;
    const sortOption: { [key: string]: SortOrder } = {
      [sort]: sortDirection === 'asc' ? 1 : -1,
    };

    const [posts, totalCount] = await Promise.all([
      this.postModel.find().sort(sortOption).skip(skip).limit(pageSize).exec(), // Sort by createdAt
      this.postModel.countDocuments(),
    ]);
    return { posts, totalCount };
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async findByBlogId(blogId: string): Promise<PostDocument[]> {
    return this.postModel.find({ blogId }).exec();
  }

  async countByBlogId(blogId: string) {
    return this.postModel.countDocuments({ blogId }).exec();
  }

  async findByBlogIdPaginated(
    blogId: string,
    skip: number,
    limit: number,
    sort: string,
    direction: 'asc' | 'desc',
  ): Promise<PostDocument[]> {
    const sortOption: { [key: string]: SortOrder } = {
      [sort]: direction === 'asc' ? 1 : -1,
    };

    return this.postModel
      .find({ blogId })
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }
}
