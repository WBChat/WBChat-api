import { User } from './schemas/user.schema'
import { UserViewData } from './types'

export const getUserViewData = (user: User): UserViewData => ({
  _id: user._id,
  username: user.username,
  avatar: user.avatar,
  status: user.status,
  created: user.created,
})
