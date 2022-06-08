/* eslint-disable no-console */
import type { QueryAffiliateOrdersArgs } from 'vtex.affiliates-commission-service'

import { parseAffiliateOrdersFilters } from '../../utils/filters'

export const totalizersProfileFieldResolver = async (
  args: Pick<QueryAffiliateOrdersArgs, 'filter'>,
  ctx: Context
) => {
  const { filter } = args
  const { affiliatesOrdersAggregate } = ctx.clients

  const where = filter ? parseAffiliateOrdersFilters(filter) : ''

  console.log(`FILTER`, filter)
  console.log(
    `FILTER NAME`,
    filter ? 'affiliateId' in filter : 'Não tem objeto'
  )
  console.log(`FILTER STATUS`, filter ? 'status' in filter : 'Não tem objeto')

  const whereCancelled = where
    ? `${where} AND status=cancelled`
    : 'status=cancelled'

  const whereApproved = where
    ? `${where} AND status=payment-approved`
    : 'status=payment-approved'

  const whereInvoiced = where
    ? `${where} AND status=invoiced`
    : 'status=invoiced'

  const commissionValues = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotalCommission',
    where
  )

  const cancelledValue = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotal',
    whereCancelled
  )

  const approvedValue = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotal',
    whereApproved
  )

  const invoicedValue = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotal',
    whereInvoiced
  )

  return {
    total: commissionValues?.all_docs_aggregated,
    totalCancelled: cancelledValue?.result,
    totalApproved: approvedValue?.result,
    totalInvoiced: invoicedValue?.result,
  }
}
