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
