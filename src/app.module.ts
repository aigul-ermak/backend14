import {
    MiddlewareConsumer,
    Module,
    NestModule,
    Provider,
} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersRepository} from './features/users/infrastructure/users.repository';
import {UsersService} from './features/users/application/users.service';
import {User, UsersEntity} from './features/users/domain/users.entity';
import {UsersController} from './features/users/api/users.controller';
import {LoggerMiddleware} from './infrastructure/middlewares/logger.middleware';
import {UsersModule} from "./features/users/users.module";
import {TestingModule} from "./features/testing/testing-module";
import {PostsModule} from "./features/posts/posts.module";
import {BlogsModule} from "./features/blogs/blogs.module";
import {AuthModule} from './features/auth/auth.module';
import {AuthController} from './features/auth/api/auth.controller';
import {AuthService} from './features/auth/application/auth.service';
import {UsersQueryRepository} from "./features/users/infrastructure/users.query-repository";
import {EmailModule} from "./features/email/email.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import configuration, {ConfigurationType} from "./settings/configuration";
import {CreateUserUseCase} from "./features/usecases/createUserUseCase";


const usersProviders: Provider[] = [UsersRepository, UsersQueryRepository, UsersService];
const usecases = [CreateUserUseCase]

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            envFilePath: ['.env.development.local', '.env.development', '.env'],
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService<ConfigurationType, true>) => {
                const environmentSettings = configService.get('environmentSettings', {
                    infer: true,
                });
                const databaseSettings = configService.get('databaseSettings', {
                    infer: true,
                });
                const uri = environmentSettings.isTesting
                    ? databaseSettings.MONGO_CONNECTION_URI_FOR_TESTS
                    : databaseSettings.MONGO_CONNECTION_URI;

                return {
                    uri
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([{name: User.name, schema: UsersEntity}]),
        UsersModule,
        TestingModule,
        PostsModule,
        BlogsModule,
        AuthModule,
        EmailModule,
    ],
    providers: [...usersProviders, AuthService, ...usecases],
    controllers: [UsersController, AuthController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
