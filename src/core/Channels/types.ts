export interface ChannelViewData {
  _id: string
  name: string
  description?: string
}

export class ChannelListResponse {
  channels: ChannelViewData[]
}
