import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import * as bcrypt from 'bcrypt';
import {randomUUID} from 'crypto';
import {add} from "date-fns";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class AccountData {
    @Prop()
    login: string;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    passwordHash: string;

    @Prop({ default: "" })
    passwordRecoveryCode: string;

    @Prop({ default: null })
    recoveryCodeExpirationDate: Date | null;

    @Prop()
    createdAt: Date;
}


@Schema()
export class EmailConfirmation {
    @Prop({ default: randomUUID() })
    confirmationCode: string;

    @Prop({
        default: add(new Date(), {
            hours: 1,
            minutes: 3,
        }),
    })
    expirationDate: Date;

    @Prop({ default: false })
    isConfirmed: boolean;
}

@Schema()
export class User {
    @Prop({ type: AccountData, required: true })
    accountData: AccountData;

    @Prop({ type: EmailConfirmation, required: true })
    emailConfirmation: EmailConfirmation;

    static async create(login: string, email: string, password: string): Promise<User> {
        const passwordHash = await User.hashPassword(password);

        return {
            accountData: {
                login,
                email,
                passwordHash,
                passwordRecoveryCode: "",
                recoveryCodeExpirationDate: null,
                createdAt: new Date().toISOString(),
            },
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3,
                }),
                isConfirmed: false,
            },
        };
    }

    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}



export const UsersEntity = SchemaFactory.createForClass(User);

// UsersEntity.pre<UserDocument>('save', async function (next) {
//     if (this.isModified('password') || this.isNew) {
//         this.password = await User.hashPassword(this.password);
//     }
//     next();
// });
