import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TestingController } from './testing-controller';
import { TestingService } from './testing-service';
import { Blog, BlogsSchema } from '../features/blogs/blogs.schema';
import { Post, PostsSchema } from '../features/posts/posts.schema';
import { User, UsersSchema } from '../features/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogsSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
  ],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
