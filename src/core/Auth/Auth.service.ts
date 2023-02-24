import { Injectable } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums'
import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { SALT } from 'src/constants/common'

import { UsersService } from '../Users/Users.service'
import { User } from '../Users/schemas/user.schema'
import { TLoginData, TUserRegistration } from './types'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registration(userRegistrationData: TUserRegistration) {
    const hashPassword = await bcrypt.hash(userRegistrationData.password, SALT)
    const createdUser = await this.usersService.createUser({
      ...userRegistrationData,
      password: hashPassword,
    })

    const tokens = this.generateTokens(createdUser)

    return tokens
  }

  async login(loginData: TLoginData) {
    const user = await this.usersService.getUserByEmail(loginData.email)

    console.log(user)
    if (!user) {
      throw new UnauthorizedException({
        error: 'Email or password is not valid.',
      })
    }

    const passwordEqual = await bcrypt.compare(
      loginData.password,
      user.password,
    )
    console.log(passwordEqual)

    if (!passwordEqual) {
      throw new UnauthorizedException({
        error: 'Email or password is not valid.',
      })
    }

    const tokens = this.generateTokens(user)

    return tokens
  }

  private async generateTokens(user: User) {
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
