import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { TErrorResponseBody } from '../types/errorResponse'

export const ApiErrorResponse = () => {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad request',
      type: TErrorResponseBody,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: TErrorResponseBody,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: TErrorResponseBody,
    }),
  )
}
