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

  const whereCancelled = where
    ? `${where} AND status=cancelled`
    : 'status=cancelled'

  const whereApproved = where
    ? `${where} AND status=payment-approved`
    : 'status=payment-approved'

  const wherePending = where
    ? `${where} AND status=payment-pending`
    : 'status=payment-pending'

  const whereCreated = where
    ? `${where} AND status=order-created`
    : 'status=order-created'

  const whereInvoiced = where
    ? `${where} AND status=invoiced`
    : 'status=invoiced'

  const approvedValue = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotal',
    whereApproved
  )

  const pendingValue = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotal',
    wherePending
  )

  const createdValue = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotal',
    whereCreated
  )

  const onGoingValue =
    approvedValue.result + pendingValue.result + createdValue.result

  if (filter?.status == null) {
    const cancelledValue = await affiliatesOrdersAggregate.aggregateValue(
      'orderTotal',
      whereCancelled
    )

    const invoicedValue = await affiliatesOrdersAggregate.aggregateValue(
      'orderTotal',
      whereInvoiced
    )

    return {
      totalCancelled: cancelledValue?.result,
      totalApproved: onGoingValue,
      totalInvoiced: invoicedValue?.result,
    }
  }

  const allOrders = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotal',
    where
  )

  return {
    totalCancelled: filter?.status === 'cancelled' ? allOrders : 0,
    totalApproved: filter?.status === 'payment-approved' ? onGoingValue : 0,
    totalInvoiced: filter?.status === 'invoiced' ? allOrders : 0,
  }
}
