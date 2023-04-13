import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ApiErrorResponse } from 'src/decorators/ErrorResponse.decorator'
import { GridQueryParams } from 'src/decorators/GridQueryParams.decorator'
import { TQueryGridParams } from 'src/types/gridParams'

import { AuthGuard } from '../../guards/AuthGuard'
import { UsersService } from './Users.service'
import { UsersListResponse } from './types'

@ApiTags('Users Controller')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/list')
  @ApiErrorResponse()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: UsersListResponse, status: 200 })
  @ApiBearerAuth()
  @GridQueryParams()
  @ApiQuery({
    name: 'direct',
    required: false,
    type: Boolean,
  })
  getUsersList(@Query() query: TQueryGridParams): Promise<UsersListResponse> {
    return this.usersService.getUsersList(query)
  }
}
