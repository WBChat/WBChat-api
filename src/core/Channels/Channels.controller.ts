import { Controller, Get, UseGuards } from '@nestjs/common'
import { Query } from '@nestjs/common/decorators'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ApiErrorResponse } from 'src/decorators/ErrorResponse.decorator'

import { AuthGuard } from '../../guards/AuthGuard'
import { ChannelsService } from './Channels.service'
import { ChannelListResponse, ChannelViewData } from './types'

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

  @Get('/get/channel')
  @ApiErrorResponse()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: ChannelViewData, status: 200 })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'channelId',
    required: true,
    type: String,
  })
  getChannelById(
    @Query() query: { channelId: string },
  ): Promise<ChannelViewData> {
    return this.channelsService.getChannelById(query.channelId)
  }
}
