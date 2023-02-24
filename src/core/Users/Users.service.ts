import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User, UserDocument } from './schemas/user.schema'
import { TCreateUserData } from './types'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).exec()
  }

  public async createUser(createUserData: TCreateUserData): Promise<User> {
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

    const newUser = new this.userModel(createUserData)

    return newUser.save()
  }
}
