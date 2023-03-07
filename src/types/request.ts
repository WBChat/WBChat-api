import { UserTokenPayload } from 'src/core/Users/types'

export interface CommonRequest {
  headers: {
    authorization?: string
  }
  user: UserTokenPayload
}
