import type {
  AffiliatesOrders,
  QueryAffiliateOrderArgs,
  QueryAffiliateOrdersArgs,
  MutationExportAffiliateOrdersArgs,
} from 'vtex.affiliates-commission-service'

import { ExportMDSheetService } from '../../services/ExportMDSheetService'
import { parseAffiliateOrdersFilters } from '../../utils/filters'
import { totalizersFieldResolver } from './totalizersFieldResolver'

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

  affiliateOrder: (
    _: unknown,
    { orderId }: QueryAffiliateOrderArgs,
    { clients: { affiliatesOrders } }: Context
  ) => affiliatesOrders.get(orderId, ['_all']),
}

export const mutations = {
  exportAffiliateOrders: async (
    _: unknown,
    { filter, sorting }: MutationExportAffiliateOrdersArgs,
    ctx: Context
  ) => {
    const { getAllMDDocuments, saveToVBase, sendFileViaEmail } =
      new ExportMDSheetService('affiliatesOrders', ctx)

    const sort = sorting ? `${sorting.field} ${sorting.order}` : undefined
    const where = filter ? parseAffiliateOrdersFilters(filter) : undefined

    getAllMDDocuments(sort, where)
      .then((documents) => saveToVBase(documents))
      .then((fileName) => sendFileViaEmail(fileName))

    return true
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
  AffiliateOrdersPage: {
    totalizers: (_: unknown, args: QueryAffiliateOrdersArgs, ctx: Context) =>
      totalizersFieldResolver(args, ctx),
  },
}
