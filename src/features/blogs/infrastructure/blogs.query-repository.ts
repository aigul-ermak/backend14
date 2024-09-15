import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Blog, BlogDocument} from "../domain/blog.entity";
import {Model} from "mongoose";
import {BlogOutputModel, BlogOutputModelMapper} from "../api/models/output/blog.output.model";


@Injectable()
export class BlogsQueryRepository {
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {
    }

    async getBlogById(blogId: string): Promise<BlogOutputModel | null> {
        const blog = this.blogModel.findById(blogId).exec();

        if (!blog) {
            return null
        }

        return BlogOutputModelMapper(blog);

    }
}
