import { Request } from 'express'
import { UserTokenPayload } from 'src/core/Users/types'

export type CommonRequest = {
  headers?: {
    authorization?: string
  }
  user: UserTokenPayload
} & Request
