import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId } from 'mongoose'
import { TUserRegistration } from 'src/core/Auth/types'

import { TUserRole } from '../types'

export type UserDocument = User & Document

@Schema({ collection: 'users' })
export class User extends TUserRegistration {
  @Prop({ required: true, type: 'ObjectId' })
  _id: ObjectId

  @Prop({ required: true, type: 'string' })
  password: string

  @Prop({ required: true, enum: TUserRole })
  role: TUserRole

  @Prop({ required: false, type: String })
  status: string

  @Prop({ required: false, type: String })
  avatar: string

  @Prop({ required: true, type: Number })
  created: number
}

export const UserSchema = SchemaFactory.createForClass(User)
