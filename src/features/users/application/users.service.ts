import {ConflictException, Injectable} from '@nestjs/common';
import {User} from '../domain/users.entity';

import {UsersRepository} from '../infrastructure/users.repository';
import {UserOutputModelMapper} from "../api/models/output/user.output.model";
import {UsersQueryRepository} from "../infrastructure/users.query-repository";
import {UserDBType} from "../types/user.types";
import {add} from "date-fns";
import bcrypt from "bcrypt";


@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
    ) {
    }

    async createUser(
        email: string,
        login: string,
        password: string,
    ) {

        const existingUser = await this.usersQueryRepository.findOneByEmail(email);

        if (existingUser) {
            throw new ConflictException(`User with this email already exists`);
        }

        const saltRounds = 10;
        const passwordHashed = await bcrypt.hash(password, saltRounds);


        const newUser: UserDBType = {
            accountData: {
                login: login,
                email: email,
                passwordHash: passwordHashed,
                passwordRecoveryCode: "",
                recoveryCodeExpirationDate: null,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: "",
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }

        return await this.usersRepository.createUser(newUser);
    }

    // async getById(userId: string): Promise<UserOutputModel | null> {
    //   return this.usersRepository.getById(userId);
    // }


    async findAll(): Promise<User[]> {
        return this.usersRepository.findAll();
    }

    async findOneByEmail(email: string): Promise<User | null> {
        const user = await this.usersQueryRepository.findOneByEmail(email);
        if (user) {
            return user;
        }
        return null;
    }

    async findOneByLogin(login: string): Promise<any | null> {
        const user = await this.usersRepository.findOneByLogin(login);
        if (user) {
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
        const {users, totalCount} = await this.usersQueryRepository.findAllPaginated(
            sort,
            direction,
            page,
            pageSize,
            searchLogin,
            searchEmail,
        );

        const mappedUsers = users.map(UserOutputModelMapper);

        return {
            users: mappedUsers,
            totalCount,
        };
    }

    async checkCredentials(loginOrEmail: string, password: string) {

        const user = await this.usersQueryRepository.findOneByLoginOrEmail(loginOrEmail);

        if (!user) {
            return null;
        }

        //const isMatch = await bcrypt.compare(password, user.password);

        // if (isMatch) {
        //     return user;
        // }

        return null;
    }
}
