import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import mongoose, { Document } from 'mongoose'

export type MessageDocument = Message & Document

@Schema({ collection: 'messages' })
export class Message {
  @Prop({ required: true, type: 'ObjectId' })
  @ApiProperty({ required: true, type: String })
  _id: mongoose.Types.ObjectId

  @Prop({ required: true, type: String })
  @ApiProperty({ required: true, type: String })
  sender: string

  @Prop({ required: false, type: String })
  @ApiProperty({ required: true, type: String })
  channel_id: string

  @Prop({ required: false, type: String })
  @ApiProperty({ required: true, type: String })
  text: string

  @Prop({ required: true, type: Number })
  @ApiProperty({ required: true, type: String })
  sendedDate: number
}

export const MessageSchema = SchemaFactory.createForClass(Message)
