import { Module, forwardRef } from '@nestjs/common'

import { AuthModule } from '../Auth/Auth.module'
import { WebSockets } from './WebSockets.gateway'

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [WebSockets],
})
export class WebSocketsModule {}
