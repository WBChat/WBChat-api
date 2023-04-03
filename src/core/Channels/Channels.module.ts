import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from '../Auth/Auth.module'
import { ChannelsController } from './Channels.controller'
import { ChannelsService } from './Channels.service'
import { Channel, ChannelSchema } from './schemas/channel.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [],
})
export class ChannelsModule {}
