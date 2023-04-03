import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import {
  MessageGroup,
  MessageGroupDocument,
} from './schemas/messageGroup.schema'

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(MessageGroup.name)
    private messageGroupModel: Model<MessageGroupDocument>,
  ) {}

  public async getUserDirect(userId: string): Promise<MessageGroup[]> {
    return await this.messageGroupModel.find({
      members: { $in: userId },
      direct: true,
    })
  }
}
