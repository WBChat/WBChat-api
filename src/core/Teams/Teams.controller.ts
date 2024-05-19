import { Body, Controller, Delete, Get, Logger, Post, Put, Query, Request, UseGuards } from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiBody,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

import { TeamsService } from './Teams.service'
import { ApiErrorResponse } from 'src/decorators/ErrorResponse.decorator'
import { AuthGuard } from 'src/guards/AuthGuard'
import { TCreateLicenseKey, TCreateTeamData, TeamListResponse } from './types'
import { CommonRequest } from 'src/types/request'
import { UserViewData } from '../Users/types'

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

  @Get('/team/members')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse()
  @ApiOkResponse({ status: 200, type: [UserViewData] })
  @ApiQuery({
    name: 'teamId',
    required: false,
    type: String,
  })
  getTeamMembers(
    @Query() query: {teamId: string}
  ): Promise<UserViewData[]> {
    return this.teamsService.getTeamMembers(query.teamId);
  }

  @Put('/team/add_member')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse()
  @ApiOkResponse({ status: 200 })
  @ApiQuery({
    name: 'teamId',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'memberId',
    required: false,
    type: String,
  })
  addTeamMember(
    @Query() query: {teamId: string, memberId: string}
  ): Promise<string> {
    return this.teamsService.addTeamMember(query.teamId, query.memberId);
  }

  @Delete('/team/remove_member')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse()
  @ApiOkResponse({ status: 200 })
  @ApiQuery({
    name: 'teamId',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'memberId',
    required: false,
    type: String,
  })
  removeTeamMember(
    @Query() query: {teamId: string, memberId: string}
  ): Promise<string> {
    return this.teamsService.removeTeamMember(query.teamId, query.memberId);
  }

  @Delete('/team/delete')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse()
  @ApiOkResponse({ status: 200 })
  @ApiQuery({
    name: 'teamId',
    required: false,
    type: String,
  })
  deleteTeam(
    @Query() query: {teamId: string}
  ): Promise<string> {
    return this.teamsService.deleteTeam(query.teamId);
  }
}
