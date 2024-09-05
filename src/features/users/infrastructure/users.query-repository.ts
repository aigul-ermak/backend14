import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from '../domain/users.entity';
import {Model, SortOrder} from 'mongoose';
import {UserOutputModel, UserOutputModelMapper} from "../api/models/output/user.output.model";

@Injectable()
export class UsersQueryRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    }

    async onModuleInit() {
        try {
            await this.userModel.collection.dropIndex('email_1');
        } catch (err) {
            if (err.code !== 27) {
                // 27 = IndexNotFound
                throw err;
            }
        }
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({email}).exec();
    }

    async getById(userId: string): Promise<UserOutputModel | null> {
        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            return null;
        }

        return UserOutputModelMapper(user);
    }

    async findOneByLoginOrEmail(loginOrEmail: string) {
        const user = await this.userModel.findOne({
            $or:
                [{'login': loginOrEmail}, {'email': loginOrEmail}]
        })

        if (!user) {
            return null;
        }

        return user;
    }

    // static async findUserByConfirmationCode(code: string) {
    //     const user= await this.userModel.findOne({"emailConfirmation.confirmationCode": code})
    //     if (!user) {
    //         return null
    //     }
    //     return userMapper(user)
    // }

}
