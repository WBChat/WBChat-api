import { ApiProperty } from '@nestjs/swagger'

export class TErrorResponseBody {
  @ApiProperty({ example: 'Error message' })
  message?: string
}
