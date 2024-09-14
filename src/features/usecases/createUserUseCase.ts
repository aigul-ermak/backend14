import {ConflictException, Injectable} from "@nestjs/common";
import {UsersRepository} from "../users/infrastructure/users.repository";
import {UsersQueryRepository} from "../users/infrastructure/users.query-repository";
import bcrypt from "bcrypt";
import {UserDBModel} from "../users/api/models/input/user-db.input.model";

@Injectable()
export class CreateUserUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
    ) {
    }

    async execute(
        email: string,
        login: string,
        password: string,
    ) {

        const existingUser = await this.usersQueryRepository.findOneByEmail(email);

        if (existingUser) {
            throw new ConflictException(`User with this email already exists`);
        }

        const saltRounds: number = 10;
        const passwordHashed: string = await bcrypt.hash(password, saltRounds);


        const newUser: UserDBModel = {
            accountData: {
                login: login,
                email: email,
                passwordHash: passwordHashed,
                passwordRecoveryCode: "",
                recoveryCodeExpirationDate: null,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: "",
                expirationDate: null,

                isConfirmed: false
            }
        }
        return await this.usersRepository.createUser(newUser);
    }

}