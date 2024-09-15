import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsRepository } from './posts.repo';
import { Post, PostsSchema } from './posts.schema';
import { Blog, BlogEntity } from '../blogs/domain/blog.entity';
import { BlogsRepository } from '../blogs/infrastructure/blogs.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogEntity }]),
  ],
  providers: [PostsService, PostsRepository, BlogsRepository],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
