import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../../users/application/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../../users/domain/users.entity";
import * as bcrypt from 'bcrypt';


export type AccessToken = string;

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user: User | null = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Password does not match');
        }
        return user;
    }

    async login(user: any) {
        const payload = {email: user.email, id: user.id};
        return {access_token: this.jwtService.sign(payload)};
    }

    // async register(user: RegisterRequestDto): Promise<AccessToken> {
    //     const existingUser = await this.usersService.findOneByEmail(user.email);
    //     if (existingUser) {
    //         throw new BadRequestException('email already exists');
    //     }
    //     const hashedPassword = await bcrypt.hash(user.password, 10);
    //     const newUser: User = { ...user, password: hashedPassword };
    //     await this.usersService.create(newUser);
    //     return this.login(newUser);
    // }

}
