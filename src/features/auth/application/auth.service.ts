import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../../users/application/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../../users/domain/users.entity";
import {UsersQueryRepository} from "../../users/infrastructure/users.query-repository";
import {UsersRepository} from "../../users/infrastructure/users.repository";
import {EmailService} from "../../email/email.service";
import { v4 as uuidv4 } from 'uuid';
import {CreateUserDto} from "../../users/api/models/input/create-user.input.dto";
import {UserDBType} from "../../users/types/user.types";
import bcrypt from "bcrypt";
import * as dateFns from "date-fns";




export type AccessToken = string;

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private readonly emailService: EmailService,
        private jwtService: JwtService,
        private readonly usersQueryRepository: UsersQueryRepository,
        private readonly usersRepository: UsersRepository
    ) {
    }

    async validateUser(loginOrEmail: string, password: string) {
        //let user: User | null = null;

        //user = await this.usersService.checkCredentials(loginOrEmail, password);

        const user = await this.usersQueryRepository.findOneByLoginOrEmail(loginOrEmail);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async login(user: any) {
        const payload = {loginOrEmail: user.email, id: user.id};
        return {accessToken: this.jwtService.sign(payload)};
    }

    async createUser(createUserDto: CreateUserDto) {

        const existsUser = await this.usersQueryRepository.findOneByLoginOrEmail(createUserDto.email);

        if (existsUser !== null) {
            throw new BadRequestException('User with this email or login already exists');
        }

        const confirmationCode = uuidv4();
        const saltRounds = 10;
        const passwordHashed = await  bcrypt.hash(createUserDto.password, saltRounds);

        const newUser: UserDBType ={
            accountData: {
                login: createUserDto.login,
                email: createUserDto.email,
                passwordHash: passwordHashed,
                passwordRecoveryCode: "",
                recoveryCodeExpirationDate: null,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: confirmationCode,
                expirationDate: dateFns.add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }

        const res = await this.usersRepository.createUser(newUser);

        if (!newUser) {
            throw new BadRequestException('User creation failed');
        }

        await this.emailService.sendEmailConfirmationMessage(newUser);

        return newUser;

    }

    // async confirmEmail(code: string) {
    //     const user = await this.usersQueryRepository.findUserByConfirmationCode(code);
    //
    //     if (!user) return false
    //
    //     if (user.emailConfirmation.confirmationCode === code) {
    //         let result: boolean = await this.usersRepository.updateConfirmation(user.id)
    //         return result
    //     }
    //     return false
    // }

}
