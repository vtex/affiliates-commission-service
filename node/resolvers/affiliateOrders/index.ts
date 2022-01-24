import type {
  AffiliatesOrders,
  QueryAffiliateOrdersArgs,
} from 'vtex.affiliates-commission-service'

import { parseAffiliateOrdersFilters } from '../../utils/filters'

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

    return affiliatesOrders.searchRaw(pagination, fields, sort, where)
  },
}

export const fieldResolvers = {
  AffiliateOrder: {
    orderId: (parent: AffiliatesOrders) => parent.id,
    orderTotal: (parent: AffiliatesOrders) =>
      typeof parent.orderTotal === 'number'
        ? parent.orderTotal / 100
        : undefined,
    orderTotalCommission: (parent: AffiliatesOrders) =>
      typeof parent.orderTotalCommission === 'number'
        ? parent.orderTotalCommission / 100
        : undefined,
  },
}
