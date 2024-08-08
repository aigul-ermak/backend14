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
import { UsersRepository } from './features/users/infrastructure/users.repo';
import { UsersService } from './features/users/application/users.service';
import { appSettings } from './settings/app.setting';
import { User, UsersEntity } from './features/users/domain/users.entity';
import { UsersController } from './features/users/api/users.controller';
import { LoggerMiddleware } from './infrastructure/middlewares/logger.middleware';
import {UsersModule} from "./features/users/users.module";
import {TestingModule} from "./features/testing/testing-module";


const usersProviders: Provider[] = [UsersRepository, UsersService];

@Module({
  imports: [
    // PostsModule,
    // BlogsModule,
    MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UsersEntity }]),
    UsersModule,
    TestingModule,
  ],
  providers: [...usersProviders],
  controllers: [UsersController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
