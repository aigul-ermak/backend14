import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../../users/application/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../../users/domain/users.entity";
import {UsersQueryRepository} from "../../users/infrastructure/users.query-repository";
import {UsersRepository} from "../../users/infrastructure/users.repository";
import {EmailService} from "../../email/email.service";
import {v4 as uuidv4} from 'uuid';
import {CreateUserDto} from "../../users/api/models/input/create-user.input.dto";
import {OutputUserItemType, UserDBType} from "../../users/types/user.types";
import bcrypt from "bcrypt";
import * as dateFns from "date-fns";
import {jwtConstants} from "../constants";
import {UserWithIdOutputModel} from "../../users/api/models/output/user.output.model";


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
            //return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.accountData.passwordHash);


        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
            //return null;
        }

        return user;
    }

    async loginUser(user: any) {
        const payload = {loginOrEmail: user.email, id: user.id};
        return {accessToken: this.jwtService.sign(payload, {secret: jwtConstants.JWT_SECRET})};
    }

    async createUser(createUserDto: CreateUserDto) {

        const existsUserByLogin = await this.usersQueryRepository.findOneByLoginOrEmail(createUserDto.login);
        const existsUserByEmail = await this.usersQueryRepository.findOneByLoginOrEmail(createUserDto.email);

        if (existsUserByLogin) {
            throw new BadRequestException({
                errorsMessages: [
                    {
                        message: 'User with this login already exists',
                        field: 'login',
                    }
                ]
            });
        }

        if (existsUserByEmail) {
            throw new BadRequestException({
                errorsMessages: [
                    {
                        message: 'User with this email already exists',
                        field: 'email',
                    }
                ]
            });
        }

        const confirmationCode = uuidv4();
        const saltRounds = 10;
        const passwordHashed = await bcrypt.hash(createUserDto.password, saltRounds);

        const newUser: UserDBType = {
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

        return res;
    }

    async confirmEmail(code: string): Promise<boolean> {

        const user = await this.usersQueryRepository.findUserByConfirmationCode(code);

        if (!user) return false;

        if (user.emailConfirmation.isConfirmed) {
            throw new BadRequestException({
                errorsMessages: [
                    {
                        message: 'Email already confirmed',
                        field: 'code',
                    }
                ]
            });
        }

        if (user.emailConfirmation.confirmationCode === code) {
            let result: boolean = await this.usersRepository.updateConfirmation(user.id)
            return result
        }
        return false;
    }

    async findUserById(id: string) {
        return await this.usersQueryRepository.getUserById(id);
    }

    async sendNewCodeToEmail(email: string): Promise<boolean> {

        const newCode: string = uuidv4();

        let user: UserWithIdOutputModel | null = await this.usersQueryRepository.findOneByLoginOrEmail(email);

        if (user!.emailConfirmation.isConfirmed) {
            throw new BadRequestException({
                errorsMessages: [
                    {
                        message: 'Email already confirmed',
                        field: 'email',
                    }
                ]
            });
        }

        await this.usersRepository.updateCode(user!.id, newCode)

        let userWithNewCode: UserWithIdOutputModel | null = await await this.usersQueryRepository.findOneByLoginOrEmail(user!.accountData.email);

        await this.emailService.sendEmailMessage(userWithNewCode);

        return true;

    }

}
