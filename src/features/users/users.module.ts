import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersEntity } from './domain/users.entity';
import { UsersService } from './application/users.service';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.repo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersEntity }]),
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
