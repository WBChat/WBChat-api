import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ApiErrorResponse } from 'src/decorators/ErrorResponse.decorator'

import { AuthService } from './Auth.service'
import { TAuthResponseData, TLoginData, TUserRegistration } from './types'

@ApiTags('Authorization Controller')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  @ApiBody({ type: TUserRegistration })
  @ApiOkResponse({ type: TAuthResponseData, status: 201 })
  @ApiErrorResponse()
  registration(@Body() userRegistrationData: TUserRegistration) {
    return this.authService.registration(userRegistrationData)
  }

  @Post('/login')
  @ApiBody({ type: TLoginData })
  @ApiOkResponse({ type: TAuthResponseData })
  @ApiErrorResponse()
  login(@Body() loginData: TLoginData) {
    return this.authService.login(loginData)
  }
}
