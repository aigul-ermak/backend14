import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TestingController } from './testing-controller';
import { TestingService } from './testing-service';
import { Blog, BlogsSchema } from '../blogs/blogs.schema';
import { Post, PostsSchema } from '../posts/posts.schema';
import { User, UsersEntity } from '../users/domain/users.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogsSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UsersEntity }]),
  ],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
