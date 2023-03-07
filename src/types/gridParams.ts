import { ApiExtraModels, ApiProperty } from '@nestjs/swagger'
import { FilterQuery, QueryOptions } from 'mongoose'

export class TPagination {
  pageSize: number
  page: number
}

export class TFilter {
  readonly field: string

  readonly values: string[]
}

export class TSearch {
  searchValue: string
  searchFields: string[]
}

export class TQueryGridParams {
  page?: number
  pageSize?: number
  filter?: string | string[]
  searchValue: string
  searchFields: string | string[]
}

export class QueryGridFilters<T> {
  pagination?: QueryOptions<T>

  filters?: FilterQuery<T>
}

export class TGridResponse {
  @ApiProperty({ type: Number })
  count: number
}

@ApiExtraModels(TSearch)
export class SearchModel {}

@ApiExtraModels(TFilter)
export class FilterModel {}
