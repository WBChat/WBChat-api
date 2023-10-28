import { BadRequestException, Injectable } from '@nestjs/common'
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

  public async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await this.messagesModel.findOne({ _id: messageId })

    if (!message || message.sender !== userId) {
      throw new BadRequestException({
        message:
          'You dont have permission to delete this message or message does not exist.',
      })
    }

    await this.messagesModel.deleteOne({ _id: messageId })
  }

  public async editMessage(messageId: string, text: string, userId: string): Promise<void> {
    const message = await this.messagesModel.findOne({ _id: messageId })

    if (!message || message.sender !== userId) {
      throw new BadRequestException({
        message:
          'You dont have permission to edit this message or message does not exist.',
      })
    }

    await this.messagesModel.updateOne({ _id: messageId }, { text })
  }

  public async addMessageReaction(messageId: string, reaction: string, userId: string): Promise<void> {
    const message = await this.messagesModel.findOne({ _id: messageId })

    if (!message) {
      throw new BadRequestException({
        message:
          'Message not found.',
      })
    }

    if (message.reactions?.[reaction]?.user_ids.includes(userId)) {
      throw new BadRequestException({
        message:
          'You can add only one same reaction.',
      })
    }

    const prevUserIds = message.reactions?.[reaction]?.user_ids ?? []
    const prevCount = Number(Boolean(message.reactions?.[reaction]))
    const prevReactions = message.reactions ?? {}

    const updatedReactions = {
      ...prevReactions,
      [reaction]: {
        count: prevCount + 1,
        user_ids: [...prevUserIds, userId]
      }
    }

    await this.messagesModel.updateOne({ _id: messageId }, { reactions: updatedReactions })
  }

  public async removeMessageReaction(messageId: string, reaction: string, userId: string): Promise<void> {
    const message = await this.messagesModel.findOne({ _id: messageId })

    if (!message) {
      throw new BadRequestException({
        message:
          'Message not found.',
      })
    }

    if (!message.reactions?.[reaction]) {
      throw new BadRequestException({
        message:
          'Reaction not found.',
      })
    }

    if (!message.reactions[reaction].user_ids.includes(userId)) {
      throw new BadRequestException({
        message:
          'You can not remove reaction that you did not add.',
      })
    }

    if (message.reactions[reaction].count === 1) {
      const {[reaction]: deleted, ...updatedReactions} = message.reactions;

      message.reactions = updatedReactions
      await message.save()
      return
    }

    const updatedReactions = {
      ...message.reactions,
      [reaction]: {
        count: message.reactions[reaction].count - 1,
        user_ids: message.reactions[reaction].user_ids.filter((id: string) => id !== userId)
      }
    }
  
    await this.messagesModel.updateOne({ _id: messageId }, { reactions: updatedReactions })
  }
}
