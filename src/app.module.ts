import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from './core/Auth/Auth.module'
import { ChannelsModule } from './core/Channels/Channels.module'
import { MessagesModule } from './core/Messages/Messages.module'
import { UsersModule } from './core/Users/Users.module'
import { WebSocketsModule } from './core/WebSockets/WebSockets.module'
import { TeamsModule } from './core/Teams/Teams.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    TeamsModule,
    MessagesModule,
    ChannelsModule,
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL ?? '', {
      dbName: 'web-beer-chat-dev',
    }),
    WebSocketsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
