import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UnauthorizedException,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import {UsersService} from "../../users/application/users.service";
import {UsersQueryRepository} from "../../users/infrastructure/users.query-repository";
import {AuthService} from "../application/auth.service";
// import {AuthGuard} from "@nestjs/passport";
import {LocalAuthGuard} from "../local-auth.guard";
import {BasicAuthGuard} from "../basic-auth.guard";
import {UserLoginDto} from "./models/input/login-user.input.dto";
import {CreateUserDto} from "../../users/api/models/input/create-user.input.dto";
import {UserOutputModel} from "../../users/api/models/output/user.output.model";
import {OutputUserItemType} from "../../users/types/user.types";
import {AuthGuard} from "../../../infrastructure/guards/auth.guard";


@Controller('auth')
export class AuthController {
    userService: UsersService;

    constructor(
        private authService: AuthService
    ) {
        this.authService = authService;
    }

    //@HttpCode(HttpStatus.OK)

    // @UseGuards(LocalAuthGuard)
    @Post('/login')
    @HttpCode(200)
    async login(@Body() loginDto: UserLoginDto) {


        const user = await this.authService.validateUser(loginDto.loginOrEmail, loginDto.password);

        if (user !== null) {
            return await this.authService.loginUser(user);
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }

    }

    //
// @Post('/password-recovery')
// async recoveryPassword(
//     @Body()
//     loginUserDto: loginUserDto) {
//
// }

    //
// @Post('/new-password')
// async createNewPassword(
//     @Body()
//         loginUserDto: loginUserDto) {
//
// }
//

    @Post('/registration-confirmation')
    @HttpCode(204)
    async confirmRegistration(@Body('code') code: string) {

        const result: boolean = await this.authService.confirmEmail(code)

        if (!result) {
            throw new BadRequestException()
        }
    }

    @Post('/registration')
    @HttpCode(204)
    async registration(
        @Body() createUserDto: CreateUserDto) {

        const result = await this.authService.createUser(
            createUserDto
        );

        if (!result) {
            throw new BadRequestException();
        }
    }

    // @Post('/registration-email-sending')
    // @HttpCode(204)
    // async registerEmailSending() {
    //
    //     const result: boolean = await this.authService.confirmEmail(code);
    //
    //     if (!result) {
    //         throw new BadRequestException()
    //     }
    //
    // }

    @UseGuards(AuthGuard)
    @Get('/me')
    @HttpCode(200)
    async getUser(
        @Req() req: Request
    ) {
        const userId = req['user']?.id;
        const userLogin = req['user'].login;

        const user = await this.authService.findUserById(userId.toString())

        if (!user) {
            throw new BadRequestException();
        }

        return ({
            "email": user.email,
            "login": user.login,
            "userId": user.id
        })
    }
}

