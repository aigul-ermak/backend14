import {Body, Controller, Get, Post} from '@nestjs/common';
import {UsersService} from "../../users/application/users.service";

@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
    ) {}

    // @Post('/login')
    // async loginUser(
    //     @Body()
    // loginUserDto: loginUserDto) {
    //
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

    @Get('/me')
    async getUser(
        @Body()
            UserDto: loginUserDto) {

    }
}
