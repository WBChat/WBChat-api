import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from './core/Auth/Auth.module'
import { UsersModule } from './core/Users/Users.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL ?? '', {
      dbName: 'web-beer-chat-dev',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
