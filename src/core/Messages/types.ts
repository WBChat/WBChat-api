import { ApiProperty } from '@nestjs/swagger'

export class TSendMessageRequest {
  @ApiProperty({ type: String, required: true })
  recipientId: string

  @ApiProperty({ type: String, required: true })
  text: string
}
