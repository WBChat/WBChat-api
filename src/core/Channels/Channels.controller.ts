import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { Body, Query } from '@nestjs/common/decorators'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ApiErrorResponse } from 'src/decorators/ErrorResponse.decorator'

import { AuthGuard } from '../../guards/AuthGuard'
import { ChannelsService } from './Channels.service'
import { ChannelListResponse, ChannelViewData, TCreateChannelData } from './types'
import { SuccessResponse } from 'src/types/responses'

@ApiTags('Channels Controller')
@Controller('/channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get('/my_channels')
  @ApiErrorResponse()
  @UseGuards(AuthGuard)
  @ApiQuery({
    name: 'teamId',
    required: true,
    type: String,
  })
  @ApiOkResponse({ type: ChannelListResponse, status: 200 })
  @ApiBearerAuth()
  async getMyChannels(@Query() query: { teamId: string },): Promise<ChannelListResponse> {
    const channels = await this.channelsService.getMyChannels(query.teamId);
    return { channels }
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

  @Post('/create/channel')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: TCreateChannelData })
  @ApiErrorResponse()
  @ApiOkResponse({ status: 200, type: SuccessResponse })
  async createChannel(
    @Body() channelData: TCreateChannelData,
  ): Promise<SuccessResponse> {
    await this.channelsService.createChannel(channelData.channelName, channelData.teamId)

    return { status: '200' }
  }
}
