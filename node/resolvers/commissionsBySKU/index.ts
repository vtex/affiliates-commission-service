import type { QueryCommissionsBySkuArgs } from 'vtex.affiliates-commission-service'

import { parseCommissionsBySKUFilters } from '../../utils/filters'

export const queries = {
  commissionsBySKU: async (
    _: unknown,
    { page, pageSize, filter, sorting }: QueryCommissionsBySkuArgs,
    { clients: { commissionBySKU } }: Context
  ) => {
    const pagination = { page, pageSize }
    const fields = ['_all']
    const sort = sorting ? `${sorting.field} ${sorting.order}` : undefined
    const where = filter ? parseCommissionsBySKUFilters(filter) : undefined

    return commissionBySKU.searchRaw(pagination, fields, sort, where)
  },
}
