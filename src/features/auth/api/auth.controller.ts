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
import {AuthGuard} from "@nestjs/passport";
import {LocalAuthGuard} from "../local-auth.guard";
import {BasicAuthGuard} from "../basic-auth.guard";
import {UserLoginDto} from "./models/input/login-user.input.dto";
import {CreateUserDto} from "../../users/api/models/input/create-user.input.dto";
import {UserOutputModel} from "../../users/api/models/output/user.output.model";


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

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.authService.login(user);
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

    // @Post('/registration-confirmation')
    // @HttpCode(204)
    // async confirmRegistration(code: string) {
    //     const result = await this.authService.confirmEmail(code)
    //
    //     if (!result) {
    //         throw new BadRequestException()
    //     }
    // }

    @Post('/registration')
    @HttpCode(204)
    async registration(
        @Body() createUserDto: CreateUserDto) {

        const result = await this.authService.createUser(
            createUserDto
        );

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

    // @Get('/me')
    // async getUser(
    //     @Req() req: Request
    // ) {
    // }
}
