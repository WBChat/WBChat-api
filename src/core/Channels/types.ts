import { ApiProperty } from '@nestjs/swagger'

export class ChannelViewData {
  @ApiProperty({ type: 'string' })
  _id: string

  @ApiProperty({ type: 'string' })
  name: string

  @ApiProperty({ type: 'string', required: false })
  description?: string
}

export class ChannelListResponse {
  channels: ChannelViewData[]
}
