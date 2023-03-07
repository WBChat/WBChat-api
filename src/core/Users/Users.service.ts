import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { getDbParams } from 'src/helpers/handleGridParams'
import { TQueryGridParams } from 'src/types/gridParams'

import { User, UserDocument } from './schemas/user.schema'
import { TCreateUserData, TUserRole, UsersListResponse } from './types'

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
    params?: TQueryGridParams,
  ): Promise<UsersListResponse> {
    const { pagination, filters } = getDbParams<UserDocument>(params)

    const users = (
      await this.userModel.find(filters ?? {}, null, pagination)
    ).map((user: User) => ({
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
      status: user.status,
      created: user.created,
    }))

    const count = await this.userModel.count()

    return {
      list: users,
      count,
    }
  }
}
