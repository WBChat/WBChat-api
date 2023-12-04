import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CommonRequest } from 'src/types/request'

import { getChannelViewData } from './helpers'
import { Channel, ChannelDocument } from './schemas/channel.schema'
import { ChannelViewData } from './types'
import { Team, TeamDocument } from '../Teams/schemas/team.schema'

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel.name)
    private channelsModel: Model<ChannelDocument>,
    @InjectModel(Team.name)
    private teamsModel: Model<TeamDocument>,
    @Inject(REQUEST) private readonly request: CommonRequest,
  ) {}

  public async createChannel(channelName: string, teamId: string): Promise<void> {
    const team = await this.teamsModel.findById(teamId);

    if (!team) {
      throw new BadRequestException({
        message: 'Team with such id does not exist.',
      })
    }

    await this.channelsModel.create({_id: new mongoose.Types.ObjectId(), name: channelName, team_id: teamId, members: team.members, created: Date.now()})
  }

  public async getMyChannels(teamId: string): Promise<ChannelViewData[]> {
    const user = this.request.user

    const team = await this.teamsModel.findById(teamId)

    if (!team) {
      throw new BadRequestException({
        message: 'User has no team with such id.',
      })
    }

    const channels = await this.channelsModel.find({ team_id: teamId, members: user._id})

    return channels.map(getChannelViewData);
  }

  public async getChannelById(channelId: string): Promise<ChannelViewData> {
    const channel = await this.channelsModel.findById(channelId)

    if (!channel) {
      throw new BadRequestException({
        message: 'Channel with such id is already exist.',
      })
    }

    return getChannelViewData(channel)
  }
}
