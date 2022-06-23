import type {
  AffiliatesOrders,
  QueryAffiliateOrderArgs,
  QueryAffiliateOrdersArgs,
  MutationExportAffiliateOrdersArgs,
} from 'vtex.affiliates-commission-service'

import { ExportMDSheetService } from '../../services/ExportMDSheetService'
import { parseAffiliateOrdersFilters } from '../../utils/filters'
import { totalizersProfileFieldResolver } from './totalizerProfileFieldResolver'
import { totalizersFieldResolver } from './totalizersFieldResolver'
import type { Affiliate } from '../../typings/affiliate'

export const queries = {
  affiliateOrders: async (
    _: unknown,
    { page, pageSize, filter, sorting }: QueryAffiliateOrdersArgs,
    { clients: { affiliatesOrders, affiliates }, state }: Context
  ) => {
    const pagination = { page, pageSize }
    const fields = ['_all']
    const sort = sorting ? `${sorting.field} ${sorting.order}` : undefined
    const affiliatesList = filter?.affiliateId
      ? ((await affiliates.search(
          pagination,
          fields,
          undefined,
          `name=*${filter?.affiliateId}*`
        )) as unknown as Affiliate[])
      : undefined

    const affiliatesIdList = affiliatesList?.map((affiliate) => affiliate.id)

    state.affiliateId = affiliatesIdList ?? []

    const where = filter
      ? parseAffiliateOrdersFilters(filter, affiliatesIdList)
      : undefined

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

    const { affiliateId } = ctx.state

    const sort = sorting ? `${sorting.field} ${sorting.order}` : undefined
    const where = filter
      ? parseAffiliateOrdersFilters(filter, affiliateId)
      : undefined

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
    totalizers: (
      _: unknown,
      args: Pick<QueryAffiliateOrdersArgs, 'filter'>,
      ctx: Context
    ) => totalizersFieldResolver(args, ctx),
    totalizersProfile: (
      _: unknown,
      args: Pick<QueryAffiliateOrdersArgs, 'filter'>,
      ctx: Context
    ) => totalizersProfileFieldResolver(args, ctx),
  },
}
