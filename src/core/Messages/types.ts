import { ApiProperty } from '@nestjs/swagger'

export class TSendMessageRequest {
  @ApiProperty({ type: String, required: true })
  recipient: string

  @ApiProperty({ type: String, required: false })
  text?: string
}
