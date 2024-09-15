import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Blog, BlogDocument} from "../domain/blog.entity";
import {isValidObjectId, Model} from "mongoose";


@Injectable()
export class BlogsQueryRepository {
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {
    }

    async getBlogById(blogId: string) {

        if (!isValidObjectId(blogId)) {
            return null;
        }
        return await this.blogModel.findById(blogId).exec();
    }
}
