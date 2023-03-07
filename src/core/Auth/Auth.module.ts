import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ACCESS_TOKEN_EXPIRES } from 'src/constants/common'

import { UsersModule } from '../Users/Users.module'
import { AuthController } from './Auth.controller'
import { AuthService } from './Auth.service'

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: ACCESS_TOKEN_EXPIRES,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
