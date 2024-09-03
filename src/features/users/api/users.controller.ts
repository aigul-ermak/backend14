import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import {UsersService} from '../application/users.service';
import {UserCreateModel} from "./models/input/create-user.input.model";
import {UserOutputModel} from "./models/output/user.output.model";
import {UsersQueryRepository} from "../infrastructure/users.query-repository";

@Controller('users')
export class UsersController {
    userService: UsersService;

    constructor(
        userService: UsersService,
        private readonly usersQueryRepository: UsersQueryRepository,
    ) {
        this.userService = userService;
    }

    @Post()
    @HttpCode(201)
    async create(
        @Body() createUserDto: UserCreateModel,
    ): Promise<UserOutputModel> {

        const result =  await  this.userService.create(
            createUserDto.email,
            createUserDto.login,
            createUserDto.password,
        );

        const user = await this.usersQueryRepository.getById(result!.id);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    @Get()
    async getAllUsers(
        @Query('sortBy') sortBy?: string,
        @Query('sortDirection') sortDirection?: string,
        @Query('pageNumber') pageNumber?: number,
        @Query('pageSize') pageSize?: number,
        @Query('searchLoginTerm') searchLoginTerm?: string,
        @Query('searchEmailTerm') searchEmailTerm?: string,
    ) {
        const sort = sortBy ?? 'createdAt';
        const direction = sortDirection?.toLowerCase() === 'asc' ? 'asc' : 'desc';
        const page = pageNumber ?? 1;
        const size = pageSize ?? 10;
        const searchLogin = searchLoginTerm ?? '';
        const searchEmail = searchEmailTerm ?? '';

        //return this.userService.findAll();
        const {users, totalCount} = await this.userService.findAllPaginated(
            sort,
            direction,
            page,
            size,
            searchLogin,
            searchEmail,
        );
        const pagesCount = Math.ceil(totalCount / size);

        return {
            pagesCount,
            page: +page,
            pageSize: +size,
            totalCount,
            items: users,
        };
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteUser(@Param('id') id: string): Promise<void> {
        const result = await this.userService.deleteUserById(id);
        if (!result) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }
}
