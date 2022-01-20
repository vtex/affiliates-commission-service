import type { QueryAffiliateOrdersArgs } from 'vtex.affiliates-commission-service'

import { parseAffiliateOrdersFilters } from '../../utils/affiliateOrders'

export const queries = {
  affiliateOrders: async (
    _: unknown,
    { page, pageSize, filter, sorting }: QueryAffiliateOrdersArgs,
    { clients: { affiliatesOrders } }: Context
  ) => {
    const pagination = { page, pageSize }
    const fields = ['_all']
    const sort = sorting ? `${sorting.field} ${sorting.order}` : undefined
    const where = filter ? parseAffiliateOrdersFilters(filter) : undefined

    let bla

    try {
      bla = await affiliatesOrders.searchRaw(pagination, fields, sort, where)

      console.info(bla)

      return bla
    } catch (e) {
      console.info(e)
    }

    return bla
  },
}
