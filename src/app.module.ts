import {
    MiddlewareConsumer,
    Module,
    NestModule,
    Provider,
} from '@nestjs/common';
// import { DatabaseModule } from './db/database.module';
import {MongooseModule} from '@nestjs/mongoose';
// import { UsersModule } from './users/users.module';
// import { TestingModule } from './testing/testing-module';
// import { PostsModule } from './posts/posts.module';
// import { BlogsModule } from './blogs/blogs.module';
import {UsersRepository} from './features/users/infrastructure/users.repository';
import {UsersService} from './features/users/application/users.service';
import {appSettings} from './settings/app.setting';
import {User, UsersEntity} from './features/users/domain/users.entity';
import {UsersController} from './features/users/api/users.controller';
import {LoggerMiddleware} from './infrastructure/middlewares/logger.middleware';
import {UsersModule} from "./features/users/users.module";
import {TestingModule} from "./features/testing/testing-module";
import {PostsModule} from "./features/posts/posts.module";
import {BlogsModule} from "./features/blogs/blogs.module";
import { AuthModule } from './features/auth/auth.module';
import { AuthController } from './features/auth/api/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import {UsersQueryRepository} from "./features/users/infrastructure/users.query-repository";



const usersProviders: Provider[] = [UsersRepository,UsersQueryRepository, UsersService];

@Module({
    imports: [
        MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
        MongooseModule.forFeature([{name: User.name, schema: UsersEntity}]),
        UsersModule,
        TestingModule,
        PostsModule,
        BlogsModule,
        AuthModule,
    ],
    providers: [...usersProviders, AuthService],
    controllers: [UsersController, AuthController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
