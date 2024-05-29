import { Controller, Get, Inject, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ApiErrorResponse } from 'src/decorators/ErrorResponse.decorator'
import { GridQueryParams } from 'src/decorators/GridQueryParams.decorator'
import { TQueryGridParams } from 'src/types/gridParams'

import { AuthGuard } from '../../guards/AuthGuard'
import { UsersService } from './Users.service'
import { UserViewData, UsersListResponse } from './types'
import { FileInterceptor } from '@nestjs/platform-express'
import { REQUEST } from '@nestjs/core'
import { CommonRequest } from 'src/types/request'

@ApiTags('Users Controller')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService, @Inject(REQUEST) private readonly request: CommonRequest) {}

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

  @Get('/user')
  @ApiErrorResponse()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: UserViewData, status: 200 })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    required: true,
    type: String,
  })
  getUser(@Query() query: {id: string}): Promise<UserViewData> {
    return this.usersService.getUserDataById(query.id)
  }

  @Post('change-user-avatar')
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  updateAvatar(@UploadedFile() file: any) {
    return this.usersService.changeUserAvatar(this.request.user._id, file.buffer)
  }
}