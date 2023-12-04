import { Channel } from './schemas/channel.schema'
import { ChannelViewData } from './types'

export const getChannelViewData = (channel: Channel): ChannelViewData => ({
  _id: String(channel._id),
  name: channel.name,
  members: channel.members,
})
