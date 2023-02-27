import { TFilter, TQueryGridParams } from 'src/types/gridParams'

export const getDbParams = (params: TQueryGridParams) => {
  const page = params.page || 0
  const pageSize = params.pageSize || 10
  const search = {
    fields: Array.isArray(params.searchFields)
      ? params.searchFields
      : [params.searchFields],
    value: params.searchValue,
  }

  const pagination = {
    limit: pageSize,
    skip: page * pageSize,
  }

  const filter = Array.isArray(params.filter) ? params.filter : [params.filter]

  let filters = params.filter
    ? filter.reduce((acc, filterJson) => {
        const filter = JSON.parse(filterJson) as TFilter

        return { ...acc, [filter.field]: { $in: filter.values } }
      }, {})
    : {}

  filters = {
    ...filters,
    ...search?.fields?.reduce((acc, field) => {
      return {
        ...acc,
        [field]: { $regex: new RegExp(`^${search.value}`, 'i') },
      }
    }, {}),
  }

  return {
    pagination,
    filters,
  }
}
