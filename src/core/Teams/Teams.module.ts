import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from '../Auth/Auth.module'
import { Team, TeamSchema } from './schemas/team.schema'
import { TeamsController } from './Teams.controller'
import { TeamsService } from './Teams.service'
import { JwtModule } from '@nestjs/jwt'
import { LicenseKey, LicenseKeySchema } from './schemas/license_key.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
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
