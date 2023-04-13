import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { getDbParams } from 'src/helpers/handleGridParams'
import { TQueryGridParams } from 'src/types/gridParams'

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
}
