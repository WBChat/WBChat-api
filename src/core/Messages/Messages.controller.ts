import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { MessagesService } from './Messages.service'

@ApiTags('Authorization Controller')
@Controller('/auth')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
}
