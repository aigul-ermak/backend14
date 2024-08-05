import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';
// import { DatabaseModule } from './db/database.module';
import { MongooseModule } from '@nestjs/mongoose';
// import { UsersModule } from './users/users.module';
// import { TestingModule } from './testing/testing-module';
// import { PostsModule } from './posts/posts.module';
// import { BlogsModule } from './blogs/blogs.module';
import { UsersRepository } from './users/users.repo';
import { UsersService } from './users/users.service';
import { appSettings } from './settings/app.setting';
import { User, UsersSchema } from './users/users.schema';
import { UsersController } from './users/users.controller';
import { LoggerMiddleware } from './middleware/logger.middleware';

const usersProviders: Provider[] = [UsersRepository, UsersService];

@Module({
  imports: [
    // MongooseModule.forRoot(process.env.MONGO_CONNECTION_URI as string),
    // DatabaseModule,
    // UsersModule,
    // TestingModule,
    // PostsModule,
    // BlogsModule,
    MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
  ],
  providers: [...usersProviders],
  controllers: [UsersController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
