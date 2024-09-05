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

    async findAllPaginated(
        sort: string,
        direction: 'asc' | 'desc',
        page: number,
        pageSize: number,
        searchLoginTerm?: string,
        searchEmailTerm?: string,
    ): Promise<{ users: User[]; totalCount: number }> {
        const skip = (page - 1) * pageSize;
        const sortOption: { [key: string]: SortOrder } = {
            [sort]: direction === 'asc' ? 1 : -1,
        };

        const filter: any = {
            $or: [],
        };
        if (searchLoginTerm) {
            const loginPattern = searchLoginTerm.replace(/%/g, '.*');
            filter.$or.push({
                login: {$regex: loginPattern, $options: 'i'},
            });
        }
        if (searchEmailTerm) {
            const emailPattern = searchEmailTerm.replace(/%/g, '.*');
            filter.$or.push({
                email: {$regex: emailPattern, $options: 'i'},
            });
        }

        // If no search terms are provided, match all documents
        if (filter.$or.length === 0) {
            delete filter.$or;
        }

        const [users, totalCount] = await Promise.all([
            this.userModel
                .find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(pageSize)
                .exec(),
            this.userModel.countDocuments(filter),
        ]);

        return {users, totalCount};
    }

}
