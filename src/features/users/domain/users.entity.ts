import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  createdAt: Date;

  @Prop({ required: true })
  password: string;

  static create(name: string, email: string | null, password: string) {
    const user = new User();
    user.login = name;
    user.email = email ?? `${randomUUID()}_${name}@it-incubator.io`;
    user.password = password;
    user.createdAt = new Date();
    return user;
  }
}

export const UsersEntity = SchemaFactory.createForClass(User);

UsersEntity.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
