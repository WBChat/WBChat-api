import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type MessageGroupDocument = MessageGroup & Document

@Schema({ collection: 'message groups' })
export class MessageGroup {
  @Prop({ required: true, type: 'string' })
  _id: string

  @Prop({ required: true, type: Boolean })
  direct: boolean

  @Prop({ required: true, type: [String] })
  members: boolean

  @Prop({ required: true, type: Number })
  created: number
}

export const MessageGroupSchema = SchemaFactory.createForClass(MessageGroup)
