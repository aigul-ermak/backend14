import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { TestingModule } from './testing/testing-module';
import { PostsModule } from './posts/posts.module';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    DatabaseModule,
    UsersModule,
    TestingModule,
    PostsModule,
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
