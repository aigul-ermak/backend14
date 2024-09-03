import {ConflictException, Injectable} from '@nestjs/common';
import { User } from '../domain/users.entity';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from '../infrastructure/users.repository';
import {UserOutputModelMapper} from "../api/models/output/user.output.model";


@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(
    email: string,
    login: string,
    password: string,
  ): Promise<{ id: string; login: string; email: string; createdAt: Date }> {
     const existingUser = await this.usersRepository.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException(`Blog with name "${name}" already exists`);
    }
    // email send message
    // this.emailAdapter.send(message);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = User.create(login, email, hashedPassword);
    const createdUser = await this.usersRepository.create(user);

    return {
      id: createdUser.id.toString(),
      login: createdUser.login,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
    };
  }

  // async getById(userId: string): Promise<UserOutputModel | null> {
  //   return this.usersRepository.getById(userId);
  // }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (user)  {
      return user;
    }
    return null;
  }

  async findOneByLogin(login: string): Promise<User | null> {
    const user = await this.usersRepository.findOneByLogin(login);
    if (user)  {
      return user;
    }
    return null;
  }

  async deleteUserById(id: string): Promise<boolean> {
    return await this.usersRepository.deleteById(id);
  }

  async findAllPaginated(
    sort: string,
    direction: 'asc' | 'desc',
    page: number,
    pageSize: number,
    searchLogin: string,
    searchEmail: string,
  ) {
    const { users, totalCount } = await this.usersRepository.findAllPaginated(
      sort,
      direction,
      page,
      pageSize,
      searchLogin,
      searchEmail,
    );

    const mappedUsers = users.map(UserOutputModelMapper);

    // const mappedUsers = users.map((user) => ({
    //   id: user._id.toString(),
    //   login: user.login,
    //   email: user.email,
    //   createdAt: user.createdAt,
    // }));

    return {
      users: mappedUsers,
      totalCount,
    };
  }
}
