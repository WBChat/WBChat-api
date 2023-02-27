import { Controller, Get, Query } from '@nestjs/common'
import { ApiBody, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger'
import { ApiErrorResponse } from 'src/decorators/ErrorResponse.decorator'
import { GridQueryParams } from 'src/decorators/GridQueryParams.decorator'
import { TQueryGridParams } from 'src/types/gridParams'

import { UsersService } from './Users.service'

@ApiTags('Users Controller')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/list')
  @ApiErrorResponse()
  @GridQueryParams()
  getUsersList(@Query() query: TQueryGridParams) {
    return this.usersService.getUsersList(query)
  }
}
