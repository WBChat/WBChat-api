import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId } from 'mongoose'
import { LicenseKeyStatus } from '../types'

export type LicenseKeyDocument = LicenseKey & Document<ObjectId>

@Schema({ collection: 'license_keys' })
export class LicenseKey {
  @Prop({ required: true, type: 'ObjectId' })
  _id: ObjectId

  @Prop({ required: true, type: 'string' })
  token: string

  @Prop({ required: true, type: 'string', enum: ['active', 'ready', 'inactive'] })
  status: LicenseKeyStatus

  @Prop({ required: true, type: Number })
  created: number
}

export const LicenseKeySchema = SchemaFactory.createForClass(LicenseKey)
