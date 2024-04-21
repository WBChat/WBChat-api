import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

import { TeamsService } from './Teams.service'
import { ApiErrorResponse } from 'src/decorators/ErrorResponse.decorator'
import { AuthGuard } from 'src/guards/AuthGuard'
import { TCreateLicenseKey, TCreateTeamData, TeamListResponse } from './types'
import { CommonRequest } from 'src/types/request'

@ApiTags('Teams Controller')
@Controller('/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post('/create/team')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: TCreateTeamData })
  @ApiErrorResponse()
  @ApiOkResponse({ status: 200 })
  createTeam(
    @Body() teamData: TCreateTeamData,
  ): Promise<string> {
    return this.teamsService.createTeam(teamData.teamName, teamData.license_key)
  }

  @Get('/my_teams')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse()
  @ApiOkResponse({ type: TeamListResponse, status: 200 })
  async getMyTeams(): Promise<TeamListResponse> {
    const teams = await this.teamsService.getMyTeams()
    return { teams };
  }

  @Post('/create/license_key')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: TCreateLicenseKey })
  @ApiErrorResponse()
  @ApiOkResponse({ status: 200 })
  createLicenseKey(
    @Body() keyData: TCreateLicenseKey,
  ): Promise<string> {
    return this.teamsService.createLicenseKey(keyData.payment_token)
  }

  @Post('/send_email/license_key')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse()
  @ApiOkResponse({ status: 200 })
  sendLicenseKey(
    @Request() req: CommonRequest
  ): Promise<void> {
    return this.teamsService.sendEmailWithLicenseKey(req.user)
  }
}
