import { Module } from '@nestjs/common'

import { AuthModule } from '../Auth/Auth.module'
import { MessagesModule } from '../Messages/Messages.module'
import { WebSockets } from './WebSockets.gateway'

@Module({
  imports: [AuthModule, MessagesModule],
  providers: [WebSockets],
})
export class WebSocketsModule {}
