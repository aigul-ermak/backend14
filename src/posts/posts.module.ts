import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsRepository } from './posts.repo';
import { Post, PostsSchema } from './posts.schema';
import { Blog, BlogsSchema } from '../blogs/blogs.schema';
import { BlogsRepository } from '../blogs/blogs.repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogsSchema }]),
  ],
  providers: [PostsService, PostsRepository, BlogsRepository],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
