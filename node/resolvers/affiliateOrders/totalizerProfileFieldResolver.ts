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

  const whereCanceled = where
    ? `${where} AND (status=canceled OR status=cancel)`
    : '(status=canceled OR status=cancel)'

  const whereOngoing = where
    ? `${where} AND (status=payment-approved OR status=payment-pending OR status=on-order-completed)`
    : '(status=payment-approved OR status=payment-pending OR status=on-order-completed)'

  const whereInvoiced = where
    ? `${where} AND status=invoiced`
    : 'status=invoiced'

  const canceledValue = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotal',
    whereCanceled
  )

  const onGoingValue = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotal',
    whereOngoing
  )

  const invoicedValue = await affiliatesOrdersAggregate.aggregateValue(
    'orderTotal',
    whereInvoiced
  )

  if (filter?.status != null) {
    return {
      totalCancelled: filter?.status === 'cancel' ? canceledValue.result : 0,
      totalOngoing: filter?.status === 'ongoing' ? onGoingValue.result : 0,
      totalInvoiced: filter?.status === 'invoiced' ? invoicedValue.result : 0,
    }
  }

  return {
    totalCancelled: canceledValue?.result,
    totalOngoing: onGoingValue?.result,
    totalInvoiced: invoicedValue?.result,
  }
}
