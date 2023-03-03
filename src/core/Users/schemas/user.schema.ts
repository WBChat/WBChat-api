import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { TUserRegistration } from 'src/core/Auth/types'

import { TUserRole } from '../types'

export type UserDocument = User & Document

@Schema({ collection: 'users' })
export class User extends TUserRegistration {
  @Prop({ required: false, type: 'string' })
  _id: string

  @Prop({ required: true, type: 'string' })
  password: string

  @Prop({ required: true, enum: TUserRole })
  role: TUserRole

  @Prop({ required: true, type: Number })
  created: number
}

export const UserSchema = SchemaFactory.createForClass(User)
