import { Transform } from 'class-transformer'

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

export class TGridParams {
  pagination?: TPagination
  filters?: TFilter[]
  search?: TSearch
}

export class TQueryGridParams {
  page?: number
  pageSize?: number
  filter?: string | string[]
  searchValue: string
  searchFields: string[]
}
