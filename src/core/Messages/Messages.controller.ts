import { Controller } from '@nestjs/common'
import { Delete, Get, Patch, Query, Request, UseGuards } from '@nestjs/common/decorators'
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
import { CommonRequest } from 'src/types/request'

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

  @Delete('/message/delete')
  @ApiErrorResponse()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ status: 200 })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'messageId',
    required: true,
    type: String,
  })
  deleteMessage(@Query() query: { messageId: string }, @Request() req: CommonRequest): Promise<void> {
    return this.messagesService.deleteMessage(query.messageId, req.user._id)
  }

  @Patch('/message/edit')
  @ApiErrorResponse()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ status: 200 })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'messageId',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'text',
    required: true,
    type: String,
  })
  editMessage(@Query() query: { messageId: string, text: string }, @Request() req: CommonRequest): Promise<void> {
    return this.messagesService.editMessage(query.messageId, query.text, req.user._id)
  }
}
