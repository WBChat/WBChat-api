import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { getDbParams } from 'src/helpers/handleGridParams'
import { TQueryGridParams } from 'src/types/gridParams'

import { getUserViewData } from './helpers'
import { User, UserDocument } from './schemas/user.schema'
import {
  GetUsersParams,
  TCreateUserData,
  TUserRole,
  UsersListResponse,
} from './types'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email }).exec()
  }

  public async createUser(
    createUserData: TCreateUserData,
    role: TUserRole,
  ): Promise<User> {
    const user = await this.getUserByEmail(createUserData.email)

    if (user) {
      throw new BadRequestException({
        message: 'User with such email is already exist.',
      })
    }

    const newUser = new this.userModel({
      ...createUserData,
      role,
      status: '',
      avatar: '',
      created: Date.now(),
    })

    return newUser.save()
  }

  public async getUsersList(
    params?: TQueryGridParams & GetUsersParams,
  ): Promise<UsersListResponse> {
    const { pagination, filters } = getDbParams<UserDocument>(params)

    if (params?.direct) {
      return {
        list: [],
        count: 0,
      }
    }

    const users = (
      await this.userModel.find(filters ?? {}, null, pagination)
    ).map(getUserViewData)

    const count = await this.userModel.count()

    return {
      list: users,
      count,
    }
  }
}
