import { Injectable } from '@nestjs/common'
import { UnauthorizedException } from '@nestjs/common/exceptions'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { SALT } from 'src/constants/common'

import { UsersService } from '../Users/Users.service'
import { User } from '../Users/schemas/user.schema'
import { TUserRole } from '../Users/types'
import { TAuthResponseData, TLoginData, TUserRegistration } from './types'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registration(
    userRegistrationData: TUserRegistration,
  ): Promise<TAuthResponseData> {
    const hashPassword = await bcrypt.hash(userRegistrationData.password, SALT)
    const createdUser = await this.usersService.createUser(
      {
        ...userRegistrationData,
        password: hashPassword,
      },
      TUserRole.User,
    )

    const tokens = this.generateTokens(createdUser)

    return tokens
  }

  async login(loginData: TLoginData): Promise<TAuthResponseData> {
    const user = await this.usersService.getUserByEmail(loginData.email)

    if (!user) {
      throw new UnauthorizedException({
        message: 'Email or password is not valid.',
      })
    }

    const passwordEqual = await bcrypt.compare(
      loginData.password,
      user.password,
    )

    if (!passwordEqual) {
      throw new UnauthorizedException({
        message: 'Email or password is not valid.',
      })
    }

    const tokens = this.generateTokens(user)

    return tokens
  }

  private async generateTokens(user: User): Promise<TAuthResponseData> {
    return {
      access_token: this.jwtService.sign({ email: user.email }),
      refresh_token: this.jwtService.sign(
        { email: user.email },
        {
          secret: process.env.JWT_REFRESH_SECRET || '',
        },
      ),
    }
  }
}
