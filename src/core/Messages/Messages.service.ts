import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RequestContext } from 'nestjs-request-context/dist/request-context.model'
import { getDbParams } from 'src/helpers/handleGridParams'
import { TQueryGridParams } from 'src/types/gridParams'
import { CommonRequest } from 'src/types/request'

import { Message, MessageDocument } from './schemas/message.schema'

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private messagesModel: Model<MessageDocument>,
  ) {}

  public async createMessage(message: Message): Promise<void> {
    await this.messagesModel.create(message)
  }

  public async getChannelMessages(
    params?: TQueryGridParams & { channelId: string },
  ): Promise<Message[]> {
    const { pagination, filters } = getDbParams<MessageDocument>(params)

    const messages = await this.messagesModel.find(
      filters ?? {},
      null,
      pagination,
    )

    return messages
  }

  public async deleteMessage(messageId: string): Promise<void> {
    const message = await this.messagesModel.findOne({ _id: messageId })
    const req = RequestContext.currentContext.req as CommonRequest

    if (!message || message.sender !== req.user._id) {
      throw new BadRequestException({
        message:
          'You dont have permission to delete this message or message does not exit.',
      })
    }

    await this.messagesModel.deleteOne({ _id: messageId })
  }

  public async editMessage(messageId: string, text: string): Promise<void> {
    const message = await this.messagesModel.findOne({ _id: messageId })
    const req = RequestContext.currentContext.req as CommonRequest

    if (!message || message.sender !== req.user._id) {
      throw new BadRequestException({
        message:
          'You dont have permission to edit this message or message does not exit.',
      })
    }

    await this.messagesModel.updateOne({ _id: messageId }, { text })
  }
}
