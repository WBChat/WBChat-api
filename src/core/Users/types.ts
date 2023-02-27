import { TUserRegistration } from '../Auth/types'

export type TCreateUserData = {} & TUserRegistration

export enum TUserRole {
  Admin = 'admin',
  User = 'user',
}
