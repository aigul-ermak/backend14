import {User, UserDocument} from "../../../domain/users.entity";
import {OutputUserItemType, UserDBType} from "../../../types/user.types";


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

export const UsersOutputModelMapper = (user: any) => {
    const outputModel = new UserOutputModel();

    outputModel.id = user.id;
    outputModel.login = user.accountData.login;
    outputModel.email = user.accountData.email;
    outputModel.createdAt = user.accountData.createdAt;

    return outputModel;
}

// export const userMapper = (user: UserDBType): OutputUserItemType => {
//     return {
//         id: user.id.toString(),
//         accountData: {
//             login: user.accountData.login,
//             email: user.accountData.email,
//             passwordHash: user.accountData.passwordHash,
//             passwordRecoveryCode: user.accountData.passwordRecoveryCode,
//             recoveryCodeExpirationDate: user.accountData.recoveryCodeExpirationDate,
//             createdAt: user.accountData.createdAt
//         },
//         emailConfirmation: {
//             confirmationCode: user.emailConfirmation.confirmationCode,
//             expirationDate: user.emailConfirmation.expirationDate,
//             isConfirmed: user.emailConfirmation.isConfirmed
//         }
//     }
// }
