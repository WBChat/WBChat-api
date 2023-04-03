import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CommonRequest } from 'src/types/request'

import { getChannelViewData } from './helpers'
import { Channel, ChannelDocument } from './schemas/channel.schema'
import { ChannelListResponse } from './types'

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel.name)
    private channelsModel: Model<ChannelDocument>,
    @Inject(REQUEST) private readonly request: CommonRequest,
  ) {}

  public async getMyChannels(): Promise<ChannelListResponse> {
    const user = this.request.user

    const channels = (
      await this.channelsModel.find({
        $or: [{ members: user._id }, { isCommon: true }],
      })
    ).map(getChannelViewData)

    return {
      channels,
    }
  }
}
