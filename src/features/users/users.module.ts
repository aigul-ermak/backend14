import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersEntity } from './domain/users.entity';
import { UsersService } from './application/users.service';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.repository';
import {UsersQueryRepository} from "./infrastructure/users.query-repository";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersEntity }]),
  ],
  providers: [UsersService, UsersRepository, UsersQueryRepository],
  controllers: [UsersController],
  exports: [UsersService, UsersQueryRepository]
})
export class UsersModule {}
