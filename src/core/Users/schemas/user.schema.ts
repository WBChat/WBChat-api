import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { TUserRegistration } from 'src/core/Auth/types'

export type UserDocument = User & Document

@Schema({ collection: 'users' })
export class User extends TUserRegistration {
  @Prop({ required: true, type: 'string' })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
