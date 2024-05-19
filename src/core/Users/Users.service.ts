import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { getDbParams } from 'src/helpers/handleGridParams'
import { TQueryGridParams } from 'src/types/gridParams'

import { getUserViewData } from './helpers'
import { User, UserDocument } from './schemas/user.schema'
import { TCreateUserData, TUserRole, UserViewData, UsersListResponse } from './types'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec()
  }

  public async getUserDataById(id: string): Promise<UserViewData> {
    const user = await this.userModel.findOne({ _id: id }).exec()

    if (!user) {
      throw new BadRequestException({
        message: 'User not found.',
      })
    }

    return getUserViewData(user);
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
      _id: new mongoose.Types.ObjectId(),
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
    ).map(getUserViewData)

    const count = await this.userModel.count(filters ?? {})

    return {
      list: users,
      count,
    }
  }
}
