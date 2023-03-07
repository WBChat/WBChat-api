import { ApiProperty } from '@nestjs/swagger'
import { TGridResponse } from 'src/types/gridParams'

import { TUserRegistration } from '../Auth/types'
import { User } from './schemas/user.schema'

export type TCreateUserData = TUserRegistration

export enum TUserRole {
  Admin = 'admin',
  User = 'user',
}

export class UserData extends TUserRegistration {
  first_name
}

export class UsersListResponse extends TGridResponse {
  @ApiProperty({ type: [User] })
  list: User[]
}

export interface UserTokenPayload {
  email: string
}
