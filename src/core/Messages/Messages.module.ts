import { Module } from '@nestjs/common'
import { forwardRef } from '@nestjs/common/utils'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from '../Auth/Auth.module'
import { MessagesController } from './Messages.controller'
import { MessagesService } from './Messages.service'
import { Message, MessageSchema } from './schemas/message.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
