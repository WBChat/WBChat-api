import { ApiProperty } from '@nestjs/swagger'
import { TGridResponse } from 'src/types/gridParams'

import { TUserRegistration } from '../Auth/types'

export type TCreateUserData = TUserRegistration

export enum TUserRole {
  Admin = 'admin',
  User = 'user',
}

export class UserViewData {
  @ApiProperty({ type: String })
  first_name: string

  @ApiProperty({ type: String })
  last_name: string

  @ApiProperty({ type: String })
  status: string

  @ApiProperty({ type: String })
  avatar: string

  @ApiProperty({ type: String })
  created: number
}

export class UsersListResponse extends TGridResponse {
  @ApiProperty({ type: [UserViewData] })
  list: UserViewData[]
}

export interface UserTokenPayload {
  email: string
}
