import { User } from './schemas/user.schema'
import { UserViewData } from './types'

export const getUserViewData = (user: User): UserViewData => ({
  first_name: user.first_name,
  last_name: user.last_name,
  avatar: user.avatar,
  status: user.status,
  created: user.created,
})
