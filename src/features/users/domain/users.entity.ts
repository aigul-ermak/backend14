import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, ObjectId} from 'mongoose';
import * as bcrypt from 'bcrypt';
import {randomUUID} from 'crypto';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    login: string;

    @Prop({required: true})
    email: string;

    @Prop()
    createdAt: Date;

    @Prop({required: true})
    password: string;

    static async create(name: string, email: string | null, password: string) {
        const user = new User();
        user.login = name;
        user.email = email ?? `${randomUUID()}_${name}@it-incubator.io`;
        user.password = await User.hashPassword(password);
        user.createdAt = new Date();
        return user;
    }

    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

export const UsersEntity = SchemaFactory.createForClass(User);

UsersEntity.pre<UserDocument>('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await User.hashPassword(this.password);
    }
    next();
});
