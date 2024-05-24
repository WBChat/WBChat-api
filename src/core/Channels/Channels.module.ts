import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from '../Auth/Auth.module'
import { ChannelsController } from './Channels.controller'
import { ChannelsService } from './Channels.service'
import { Channel, ChannelSchema } from './schemas/channel.schema'
import { TeamsModule } from '../Teams/Teams.module'
import { Team, TeamSchema } from '../Teams/schemas/team.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }]),
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    forwardRef(() => TeamsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
