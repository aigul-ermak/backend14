import {NotFoundException} from "@nestjs/common";
import {BlogsRepository} from "../blogs/infrastructure/blogs.repository";
import {UpdateBlogDto} from "../blogs/api/models/input/create-blog.input.dto";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";


export class UpdateBlogUseCaseCommand {
    constructor(public id: string, public updateBlogDto: UpdateBlogDto) {
    }
}


@CommandHandler(UpdateBlogUseCaseCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogUseCaseCommand> {
    constructor(private blogsRepository: BlogsRepository) {
    }

    async execute(command: UpdateBlogUseCaseCommand) {
        const {id, updateBlogDto} = command;
        return await this.blogsRepository.update(id, updateBlogDto);
        // if (!updatedBlog) {
        //     throw new NotFoundException(`Blog with not found`);
        // }
        // return updatedBlog;
    }
}
