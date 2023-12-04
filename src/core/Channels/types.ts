import { ApiProperty } from '@nestjs/swagger'

export class ChannelViewData {
  @ApiProperty({ type: 'string' })
  _id: string

  @ApiProperty({ type: 'string' })
  name: string

  @ApiProperty({ type: [String] })
  members: string[]

  @ApiProperty({ type: 'string', required: false })
  description?: string
}

export class TCreateChannelData {
  @ApiProperty({ type: String })
  channelName: string

  @ApiProperty({ type: String })
  teamId: string
}

export class ChannelListResponse {
  @ApiProperty({ type: [ChannelViewData], required: true })
  channels: ChannelViewData[]
}
