import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ApiErrorResponse } from 'src/decorators/ErrorResponse.decorator'
import { GridQueryParams } from 'src/decorators/GridQueryParams.decorator'
import { TQueryGridParams } from 'src/types/gridParams'

import { AuthGuard } from '../Auth/guards/AuthGuard'
import { UsersService } from './Users.service'
import { GetUsersParams, UsersListResponse } from './types'

@ApiTags('Users Controller')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/list')
  @ApiErrorResponse()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: UsersListResponse, status: 200 })
  @GridQueryParams()
  @ApiQuery({
    name: 'direct',
    required: false,
    type: Boolean,
  })
  getUsersList(
    @Query() query: TQueryGridParams & GetUsersParams,
  ): Promise<UsersListResponse> {
    return this.usersService.getUsersList(query)
  }
}
