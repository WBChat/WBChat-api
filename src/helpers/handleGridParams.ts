import { FilterQuery } from 'mongoose'
import {
  QueryGridFilters,
  TFilter,
  TQueryGridParams,
} from 'src/types/gridParams'

export const getDbParams = <T>(
  params?: TQueryGridParams,
): QueryGridFilters<T> => {
  const page = params?.page
  const pageSize = params?.pageSize
  const search = {
    fields: Array.isArray(params?.searchFields)
      ? params?.searchFields
      : [params?.searchFields],
    value: params?.searchValue,
  }

  const pagination =
    page && pageSize
      ? {
          limit: pageSize,
          skip: page * pageSize,
        }
      : undefined

  const filter = Array.isArray(params?.filter)
    ? params?.filter
    : [params?.filter]

  const filters: FilterQuery<T> | undefined = params?.filter
    ? filter?.reduce((acc, filterJson) => {
        if (!filterJson) {
          return acc
        }

        const filter = JSON.parse(filterJson) as TFilter

        return { ...acc, [filter.field]: { $in: filter.values } }
      }, {})
    : {}

  Object.assign(filters ?? {}, {
    ...filters,
    ...search.fields?.reduce((acc: FilterQuery<T>, field: string) => {
      return {
        ...acc,
        [field]: { $regex: new RegExp(`^${search.value ?? ''}`, 'i') },
      }
    }, {}),
  })

  return {
    pagination,
    filters,
  }
}
