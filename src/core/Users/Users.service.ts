import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { getDbParams } from 'src/helpers/handleGridParams'
import { TQueryGridParams } from 'src/types/gridParams'

import { User, UserDocument } from './schemas/user.schema'
import { TCreateUserData, TUserRole } from './types'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).exec()
  }

  public async createUser(
    createUserData: TCreateUserData,
    role: TUserRole,
  ): Promise<User> {
    const user = await this.getUserByEmail(createUserData.email)

    if (user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User with such email is already exist.',
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    const newUser = new this.userModel({
      createUserData,
      role,
      created: Date.now(),
    })

    return newUser.save()
  }

  public async getUsersList(params?: TQueryGridParams) {
    console.log(params)
    const { pagination, filters } = getDbParams(params)

    console.log(filters)
    const users = await this.userModel.find({ ...filters }, null, pagination)
    const count = await this.userModel.count()

    return {
      list: users,
      count,
    }
  }
}
