import { Module } from '@nestjs/common'

import { AuthModule } from '../Auth/Auth.module'
import { MessagesModule } from '../Messages/Messages.module'
import { WebSockets } from './WebSockets.gateway'
import { ChannelsModule } from '../Channels/Channels.module'
import { UsersModule } from '../Users/Users.module'

@Module({
  imports: [AuthModule, MessagesModule, ChannelsModule, UsersModule],
  providers: [WebSockets],
})
export class WebSocketsModule {}
