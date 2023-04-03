import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { MessagesService } from './Messages.service'
import { MessageGroup, MessageGroupSchema } from './schemas/messageGroup.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MessageGroup.name, schema: MessageGroupSchema },
    ]),
  ],
  controllers: [],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class UsersModule {}
