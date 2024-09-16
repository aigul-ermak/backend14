import {BlogsRepository} from "../blogs/infrastructure/blogs.repository";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";

export class DeleteBlogByIdUseCaseCommand {
    constructor(public id: string) {
    }
}

@CommandHandler(DeleteBlogByIdUseCaseCommand)
export class DeleteBlogByIdUseCase implements ICommandHandler<DeleteBlogByIdUseCaseCommand> {
    constructor(
        private blogsRepository: BlogsRepository) {
    }

    async execute(command: DeleteBlogByIdUseCaseCommand) {
        return await this.blogsRepository.deleteById(command.id);
    }

}