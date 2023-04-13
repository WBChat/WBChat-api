import { Module, forwardRef } from '@nestjs/common'

import { AuthModule } from '../Auth/Auth.module'
import { MessagesModule } from '../Messages/Messages.module'
import { WebSockets } from './WebSockets.gateway'

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => MessagesModule)],
  providers: [WebSockets],
})
export class WebSocketsModule {}
