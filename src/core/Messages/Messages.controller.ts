import { Controller } from '@nestjs/common'
import { Get, Query, UseGuards } from '@nestjs/common/decorators'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ApiErrorResponse } from 'src/decorators/ErrorResponse.decorator'
import { GridQueryParams } from 'src/decorators/GridQueryParams.decorator'
import { AuthGuard } from 'src/guards/AuthGuard'
import { TQueryGridParams } from 'src/types/gridParams'

import { MessagesService } from './Messages.service'
import { Message } from './schemas/message.schema'

@ApiTags('Messages Controller')
@Controller('/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('/channel-messages')
  @ApiErrorResponse()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: [Message], status: 200 })
  @ApiBearerAuth()
  @GridQueryParams()
  @ApiQuery({
    name: 'channelId',
    required: true,
    type: String,
  })
  getChannelMessages(
    @Query() query: TQueryGridParams & { channelId: string },
  ): Promise<Message[]> {
    return this.messagesService.getChannelMessages(query)
  }
}
