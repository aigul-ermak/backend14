import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogsSchema } from './blogs.schema';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogsSchema }]),
    PostsModule,
  ],
  providers: [BlogsService, BlogsRepository],
  controllers: [BlogsController],
})
export class BlogsModule {}
