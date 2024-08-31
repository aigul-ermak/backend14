import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../../users/application/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../../users/domain/users.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    // async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    //     const user = await this.usersService.findOne(username);
    //     if (user?.password !== pass) {
    //         throw new UnauthorizedException();
    //     }
    //     const payload = { sub: user.userId, username: user.username };
    //     return {
    //         access_token: await this.jwtService.signAsync(payload),
    //     };
    // }

    async validateUser(email: string, password: string): Promise<User> {
        const user: User = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const isMatch: boolean = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Password does not match');
        }
        return user;
    }
    async login(user: User): Promise<AccessToken> {
        const payload = { email: user.email, id: user.id };
        return { access_token: this.jwtService.sign(payload) };
    }
    async register(user: RegisterRequestDto): Promise<AccessToken> {
        const existingUser = await this.usersService.findOneByEmail(user.email);
        if (existingUser) {
            throw new BadRequestException('email already exists');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser: User = { ...user, password: hashedPassword };
        await this.usersService.create(newUser);
        return this.login(newUser);
    }

}
