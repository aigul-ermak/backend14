import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from '../domain/users.entity';
import {Model, SortOrder} from 'mongoose';
import {CreateUserDto} from "../api/models/input/create-user.input.dto";
import {UserDBType} from "../types/user.types";

@Injectable()
export class UsersRepository {
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

    async createUser(user: UserDBType) {
        const result = await this.userModel.create(user);
        return result._id.toString();
    }

    async findOneByLogin(login: string): Promise<User | null> {
        return this.userModel.findOne({"accountData.login": login}).exec();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        return result !== null;
    }

}
