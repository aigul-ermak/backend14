import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from '../domain/users.entity';
import {Model, SortOrder} from 'mongoose';

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

    async create(user: any): Promise<UserDocument> {
        const createdUser = new this.userModel(user);
        return createdUser.save();
    }

    async findOneByLogin(login: string): Promise<User | null> {
        return this.userModel.findOne({login}).exec();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        return result !== null;
    }

}
