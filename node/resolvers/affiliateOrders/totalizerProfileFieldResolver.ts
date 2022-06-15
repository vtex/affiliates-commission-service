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

  if (filter?.status != null) {
    const allOrders = await affiliatesOrdersAggregate.aggregateValue(
      'orderTotal',
      where
    )

    return {
      totalCancelled: filter?.status === 'cancelled' ? allOrders : 0,
      totalApproved: filter?.status === 'payment-approved' ? allOrders : 0,
      totalInvoiced: filter?.status === 'invoiced' ? allOrders : 0,
    }
  }

  const whereCancelled = where
    ? `${where} AND status=cancelled`
    : 'status=cancelled'

  const whereApproved = where
    ? `${where} AND status=payment-approved`
    : 'status=payment-approved'

  const whereInvoiced = where
    ? `${where} AND status=invoiced`
    : 'status=invoiced'

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
    totalCancelled: cancelledValue?.result,
    totalApproved: approvedValue?.result,
    totalInvoiced: invoicedValue?.result,
  }
}
