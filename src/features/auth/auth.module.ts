import {Module} from '@nestjs/common';
import {UsersModule} from "../users/users.module";
import {AuthService} from "./application/auth.service";
import {AuthController} from "./api/auth.controller";
import {jwtConstants} from "./constants";
import {APP_GUARD} from "@nestjs/core";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {LocalStrategy} from "./local.strategy";
import {BasicStrategy} from "./basic.strategy";
import {EmailModule} from "../email/email.module";

@Module
({
    imports: [
        UsersModule,
        EmailModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.jwr_secret,
            signOptions: {expiresIn: '60s'},
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtService, BasicStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})

export class AuthModule {
}
