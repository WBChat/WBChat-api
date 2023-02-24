import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'

import { AuthService } from './Auth.service'
import { TLoginData, TUserRegistration } from './types'

@ApiTags('Authorization Controller')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  @ApiBody({ type: TUserRegistration })
  registration(@Body() userRegistrationData: TUserRegistration) {
    return this.authService.registration(userRegistrationData)
  }

  @Post('/login')
  @ApiBody({ type: TLoginData })
  login(@Body() loginData: TLoginData) {
    return this.authService.login(loginData)
  }
}
