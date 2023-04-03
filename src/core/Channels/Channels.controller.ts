import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ApiErrorResponse } from 'src/decorators/ErrorResponse.decorator'

import { AuthGuard } from '../Auth/guards/AuthGuard'
import { ChannelsService } from './Channels.service'
import { ChannelListResponse } from './types'

@ApiTags('Channels Controller')
@Controller('/channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get('/my/list')
  @ApiErrorResponse()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: ChannelListResponse, status: 200 })
  @ApiBearerAuth()
  getMyChannels(): Promise<ChannelListResponse> {
    return this.channelsService.getMyChannels()
  }
}
