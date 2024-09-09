import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Query, UseGuards,
} from '@nestjs/common';
import {UsersService} from '../application/users.service';
import {CreateUserDto} from "./models/input/create-user.input.dto";
import {UserOutputModel} from "./models/output/user.output.model";
import {UsersQueryRepository} from "../infrastructure/users.query-repository";
import {BasicAuthGuard} from "../../auth/basic-auth.guard";
import {GetAllUsersQueryDto} from "./models/output/users.output.model";
import {SortUserDto} from "./models/output/sort.user.dto";

@Controller('users')
export class UsersController {
    usersService: UsersService;

    constructor(
        userService: UsersService,
        private readonly usersQueryRepository: UsersQueryRepository,
    ) {
        this.usersService = userService;
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    @HttpCode(201)
    async create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserOutputModel> {

        const userId = await this.usersService.createUser(
            createUserDto.email,
            createUserDto.login,
            createUserDto.password,
        );

        const user = await this.usersQueryRepository.getUserById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    @Get()
    async getAllUsers(@Query() sortData: SortUserDto) {
        return this.usersService.getAllUsers(sortData);
    }

    // @Get()
    // async getAllUsers(
    //     @Query() query: GetAllUsersQueryDto) {
    //     const sort = query.sortBy ?? 'accountData.createdAt';
    //     const direction = query.sortDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';
    //     const page = query.pageNumber ?? 1;
    //     const size = query.pageSize ?? 10;
    //     const searchLogin = query.searchLoginTerm ?? '';
    //     const searchEmail = query.searchEmailTerm ?? '';
    //
    //     //return this.userService.findAll();
    //     const {users, totalCount} = await this.userService.getAllUsers(
    //         sort,
    //         direction,
    //         page,
    //         size,
    //         searchLogin,
    //         searchEmail,
    //     );
    //     const pagesCount = Math.ceil(totalCount / size);
    //
    //     return {
    //         pagesCount,
    //         page: +page,
    //         pageSize: +size,
    //         totalCount,
    //         items: users,
    //     };
    // }

    @UseGuards(BasicAuthGuard)
    @Delete(':id')
    @HttpCode(204)
    async deleteUser(@Param('id') id: string): Promise<void> {
        const result = await this.usersService.deleteUserById(id);
        if (!result) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }
}
