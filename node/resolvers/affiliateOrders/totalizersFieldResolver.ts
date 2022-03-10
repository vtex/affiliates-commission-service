import type { QueryAffiliateOrdersArgs } from 'vtex.affiliates-commission-service'

import { parseAffiliateOrdersFilters } from '../../utils/filters'

export const totalizersFieldResolver = async (
  args: QueryAffiliateOrdersArgs,
  ctx: Context
) => {
  const { filter } = args
  const { affiliatesOrdersAggregate } = ctx.clients

  const where = filter ? parseAffiliateOrdersFilters(filter) : ''
  const commissionValues = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotalCommission',
    where
  )

  const totalOrderValues = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotal',
    where
  )

  return {
    total: commissionValues?.all_docs_aggregated,
    totalCommissionSum: commissionValues?.result / 100,
    totalOrderSum: totalOrderValues?.result / 100,
  }
}
