import {ConflictException, Injectable} from '@nestjs/common';
import {User} from '../domain/users.entity';

import {UsersRepository} from '../infrastructure/users.repository';
import {UserOutputModel, UserOutputModelMapper, UsersOutputModelMapper} from "../api/models/output/user.output.model";
import {UsersQueryRepository} from "../infrastructure/users.query-repository";
import {UserDBType} from "../types/user.types";
import {add} from "date-fns";
import bcrypt from "bcrypt";
import {SortUserDto} from "../api/models/output/sort.user.dto";
import {PaginatedDto} from "../api/models/output/paginated.users.dto";


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
                expirationDate: null,

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

    async getAllUsers(
        sortData: SortUserDto
    ): Promise<PaginatedDto<User>> {
        const sortBy = sortData.sortBy ?? 'createdAt';
        const sortDirection = sortData.sortDirection ?? 'desc';
        const pageNumber = sortData.pageNumber ?? 1;
        const pageSize = sortData.pageSize ?? 10;
        const searchLoginTerm = sortData.searchLoginTerm ?? null;
        const searchEmailTerm = sortData.searchEmailTerm ?? null;

        type FilterType = {
            $or?: ({
                $regex: string;
                $options: string;
            } | {})[];
        };
        let filter: FilterType = {$or: []};
        if (searchEmailTerm) {
            filter['$or']?.push({email: {$regex: searchEmailTerm, $options: 'i'}});
        }
        if (searchLoginTerm) {
            filter['$or']?.push({login: {$regex: searchLoginTerm, $options: 'i'}});
        }
        if (filter['$or']?.length === 0) {
            filter['$or']?.push({});
        }

        //const users: WithId<UserType>[] = await UserModel
        //TODO any here
        const {users, totalCount}: any = await this.usersQueryRepository.findAllPaginated(filter, sortData)
        const pageCount: number = Math.ceil(totalCount / +pageSize);

       return {
            pagesCount: pageCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: users.map(UserOutputModelMapper)
        }
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
