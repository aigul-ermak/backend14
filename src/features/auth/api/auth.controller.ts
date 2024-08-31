import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {UsersService} from "../../users/application/users.service";
import {UsersQueryRepository} from "../../users/infrastructure/users.query-repository";
import {AuthService} from "../application/auth.service";
import {AuthGuard} from "@nestjs/passport";


@Controller('auth')
export class AuthController {
    userService: UsersService;

    constructor(
        private authService: AuthService,
        //userService: UsersService,
        private readonly usersQueryRepository: UsersQueryRepository,
    ) {
        this.authService = authService;
    }

    //@HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Req() req) {
        return this.authService.login(req.user);
    }


// @UseGuards(AuthGuard)
// @Get('profile')
// getProfile(@Request() req) {
//     return req.user;
// }

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
// async confirmRegistration(
//     @Body()
//         loginUserDto: loginUserDto) {
//
// }
//
// @Post('/registration')
// async registerUser(
//     @Body()
//         loginUserDto: loginUserDto) {
//
// }
//
// @Post('/registration-email-sending')
// async registerEmailSending(
//     @Body()
//         loginUserDto: loginUserDto) {
//
// }

// @Get('/me')
// async getUser(
//     @Req() req: Request
// ): Promise<UserOutputModel> {
//     const userId = req.user!.id
//
//     const user = await this.usersQueryRepository.getById(userId);
//
//     if (!user) {
//         throw new Error('User not found');
//     }
//
//     return user;
// }
}
