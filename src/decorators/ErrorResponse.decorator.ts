import { applyDecorators } from '@nestjs/common'
import { ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'

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
  )
}
