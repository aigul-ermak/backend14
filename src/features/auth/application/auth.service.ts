import {BadRequestException, ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../../users/application/users.service";
import {JwtService} from "@nestjs/jwt";
import {User, UserDocument} from "../../users/domain/users.entity";
import {UsersQueryRepository} from "../../users/infrastructure/users.query-repository";
import {UsersRepository} from "../../users/infrastructure/users.repository";
import * as bcrypt from "bcrypt";
import {EmailService} from "../../email/email.service";


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
        let user: User | null = null;

        user = await this.usersService.checkCredentials(loginOrEmail, password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;

        // if (!user) {
        //     throw new UnauthorizedException('User not found');
        // }
        // const isMatch = bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     throw new UnauthorizedException('Password does not match');
        // }
        // return user;
    }

    async login(user: any) {
        const payload = {loginOrEmail: user.email, id: user.id};
        return {accessToken: this.jwtService.sign(payload)};
    }

    async createUser(email, login, password) {

        const existsUser = await this.usersQueryRepository.findOneByLoginOrEmail(email);

        if (existsUser !== null) {
            throw new BadRequestException('User with this email or login already exists');
        }

        const user = await User.create(login, email, password);

        const createdUser: User = await this.usersRepository.create(user);

        if (!createdUser) {
            throw new BadRequestException('User creation failed');
        }

        await this.emailService.sendEmailConfirmationMessage(user);

        return user;

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
