import {UserDocument} from "../../../domain/users.entity";


export class UserOutputModel {
    id: string;
    login: string
    email: string
    createdAt: Date
}

//mappers

export const UserOutputModelMapper = (user: UserDocument): UserOutputModel => {
    const outputModel = new UserOutputModel();

    outputModel.id = user.id;
    outputModel.login = user.accountData.login;
    outputModel.email = user.accountData.email;
    outputModel.createdAt = user.accountData.createdAt;

    return outputModel;
}