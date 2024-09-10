import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from '../domain/users.entity';
import {FilterQuery, Model, SortOrder} from 'mongoose';
import {
    UserOutputModel,
    UserOutputModelMapper, UserWithIdOutputModel,
    UserWithIdOutputModelMapper
} from "../api/models/output/user.output.model";
import {SortUserDto} from "../api/models/output/sort.user.dto";

@Injectable()
export class UsersQueryRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({"accountData.email": email}).exec();
    }

    async getUserById(userId: string): Promise<UserOutputModel | null> {
        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            return null;
        }

        return UserOutputModelMapper(user);
    }

    async findOneByLoginOrEmail(loginOrEmail: string): Promise<UserWithIdOutputModel | null> {
        const user = await this.userModel.findOne({
            $or:
                [
                    {'accountData.login': loginOrEmail},
                    {'accountData.email': loginOrEmail}
                ]
        })

        if (!user) {
            return null;
        }
        return UserWithIdOutputModelMapper(user);
    }


    async findUserByConfirmationCode(code: string) {
        const user: any = await this.userModel.findOne({"emailConfirmation.confirmationCode": code})
        if (!user) {
            return null;
        }

        return user;
    }

    // private buildFilter(searchLoginTerm?: string, searchEmailTerm?: string) {
    //     type FilterType = {
    //         $or?: ({
    //             $regex: string;
    //             $options: string;
    //         } | {})[];
    //     };
    //
    //     let filter: FilterType = { $or: [] };
    //
    //     if (searchEmailTerm) {
    //         filter['$or']?.push({
    //             email: { $regex: searchEmailTerm, $options: 'i' },
    //         });
    //     }
    //
    //     if (searchLoginTerm) {
    //         filter['$or']?.push({
    //             login: { $regex: searchLoginTerm, $options: 'i' },
    //         });
    //     }
    //
    //     // Remove $or if no conditions are present
    //     if (filter['$or']?.length === 0) {
    //         delete filter.$or;
    //     }
    //
    //     return filter;
    // }

    async findAllPaginated(filter, sortData: SortUserDto) {
        const sortBy = sortData.sortBy ?? 'createdAt';
        const sortDirection = sortData.sortDirection ?? 'desc';
        const pageNumber = sortData.pageNumber ?? 1;
        const pageSize = sortData.pageSize ?? 10;
        const searchLoginTerm = sortData.searchLoginTerm ?? null;
        const searchEmailTerm = sortData.searchEmailTerm ?? null;

        console.log(`Sorting by: ${sortBy} in ${sortDirection} order`);
        console.log(`Page number: ${pageNumber}, Page size: ${pageSize}`);

        const users = await this.userModel
            .find(filter)
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip((pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .exec();

        const totalCount = await this.userModel.countDocuments(filter);

        return {users, totalCount};
    }

    async findAll(filter: FilterQuery<User>, sortBy: string, sortDirection: string, skip: number, limit: number) {
        return this.userModel
            .find(filter)
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip(skip)
            .limit(limit)
            .exec();
    }

    async countDocuments(filter: FilterQuery<User>): Promise<number> {
        return this.userModel.countDocuments(filter).exec();
    }
}

