import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId } from 'mongoose'

export type ChannelDocument = Channel & Document

@Schema({ collection: 'channels' })
export class Channel {
  @Prop({ required: true, type: 'ObjectId' })
  _id: ObjectId

  @Prop({ required: true, type: 'ObjectId' })
  team_id: ObjectId

  @Prop({ required: true, type: 'string' })
  name: string

  @Prop({ required: false, type: [String] })
  members: string[]

  @Prop({ required: false, type: 'object' })
  call_room_users: Record<string, string>

  @Prop({ required: true, type: Number })
  created: number
}

export const ChannelSchema = SchemaFactory.createForClass(Channel)
