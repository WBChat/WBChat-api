import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId } from 'mongoose'

export type TeamDocument = Team & Document<ObjectId>

@Schema({ collection: 'teams' })
export class Team {
  @Prop({ required: true, type: 'ObjectId' })
  _id: ObjectId

  @Prop({ required: true, type: 'string' })
  name: string

  @Prop({ required: true, type: 'string' })
  license_key_id: string

  @Prop({ required: true, type: [String] })
  members: string[]

  @Prop({ required: true, type: Number })
  created: number
}

export const TeamSchema = SchemaFactory.createForClass(Team)
