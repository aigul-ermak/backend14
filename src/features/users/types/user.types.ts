export type UserDBType = {
    accountData: {
        login: string,
        email: string,
        passwordHash: string,
        passwordRecoveryCode: string,
        recoveryCodeExpirationDate: Date | null,
        createdAt: string
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date | null,
        isConfirmed: boolean
    }
}

export type OutputUserItemType = {
    id: string,
    accountData: {
        login: string,
        email: string,
        passwordHash: string,
        passwordRecoveryCode: string,
        recoveryCodeExpirationDate: Date | null,
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}