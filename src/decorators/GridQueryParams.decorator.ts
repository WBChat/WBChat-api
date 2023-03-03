import { applyDecorators } from '@nestjs/common'
import { ApiQuery, getSchemaPath } from '@nestjs/swagger'
import {
  FilterModel,
  SearchModel,
  TFilter,
  TSearch,
} from 'src/types/gridParams'

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
      example: ['{ "field": "level", "values": ["Junior"] }'],
      schema: {
        type: 'array',
        items: {
          $ref: getSchemaPath(FilterModel),
        },
      },
    }),
    ApiQuery({
      name: 'search',
      required: false,
      explode: true,
      style: 'form',
      example: { searchValue: '', searchFields: ['level'] },
      schema: {
        $ref: getSchemaPath(SearchModel),
      },
    }),
  )
}
