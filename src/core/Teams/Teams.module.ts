import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from '../Auth/Auth.module'
import { Team, TeamSchema } from './schemas/team.schema'
import { TeamsController } from './Teams.controller'
import { TeamsService } from './Teams.service'
import { JwtModule } from '@nestjs/jwt'
import { LicenseKey, LicenseKeySchema } from './schemas/license_key.schema'
import { MailModule } from '../Mail/Mail.module'
import { UsersModule } from '../Users/Users.module'
import { User, UserSchema } from '../Users/schemas/user.schema'

@Module({
  imports: [
    MailModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: LicenseKey.name, schema: LicenseKeySchema }]),
    JwtModule.registerAsync({
        useFactory: () => ({
          secret: process.env.LICENSE_KEY_SECRET,
        }),
      }),
    forwardRef(() => AuthModule),
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [],
})
export class TeamsModule {}
