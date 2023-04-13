import { ApiProperty } from '@nestjs/swagger'

export class ChannelViewData {
  @ApiProperty({ type: 'string' })
  _id: string

  @ApiProperty({ type: 'string' })
  name: string

  @ApiProperty({ type: 'boolean', required: false })
  isCommon?: boolean

  @ApiProperty({ type: 'string', required: false })
  description?: string
}

export class ChannelListResponse {
  @ApiProperty({ type: [ChannelViewData], required: true })
  channels: ChannelViewData[]
}
