import { applyDecorators } from '@nestjs/common'
import { ApiQuery, getSchemaPath } from '@nestjs/swagger'
import { TFilter, TSearch } from 'src/types/gridParams'

export const GridQueryParams = () => {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      type: Number,
    }),
    ApiQuery({
      name: 'filter',
      required: false,
      explode: true,
      style: 'form',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          example: { field: 'level', values: ['Junior', 'Middle'] },
          $ref: getSchemaPath(TFilter),
        },
      },
    }),
    ApiQuery({
      name: 'search',
      required: false,
      explode: true,
      style: 'form',
      schema: {
        type: 'object',
        example: { searchValue: 'test', searchFields: ['first_name'] },
        $ref: getSchemaPath(TSearch),
      },
    }),
  )
}
