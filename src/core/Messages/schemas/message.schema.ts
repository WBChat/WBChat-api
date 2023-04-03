import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type MessageDocument = Message & Document

@Schema({ collection: 'messages' })
export class Message {
  @Prop({ required: true, type: 'string' })
  _id: string

  @Prop({ required: true, type: String })
  sender: string

  @Prop({ required: false, type: String })
  channel_id: string

  @Prop({ required: false, type: String })
  text?: string

  @Prop({ required: true, type: Number })
  sended: number
}

export const MessageSchema = SchemaFactory.createForClass(Message)
