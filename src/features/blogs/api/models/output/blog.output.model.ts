export class BlogOutputModel {
    id: string;
    login: string
    description: string
    websiteUrl: string
    createdAt: Date
    isMembership: boolean
}

export const BlogOutputModelMapper = (blog: any) => {
    const outputModel = new BlogOutputModel();

    outputModel.id = blog.id;
    outputModel.login = blog.login;
    outputModel.description = blog.description;
    outputModel.websiteUrl = blog.websiteUrl;
    outputModel.createdAt = blog.createdAt;
    outputModel.isMembership = blog.isMembership

    return outputModel;
}