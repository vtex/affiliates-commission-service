import type { QueryAffiliateOrdersArgs } from 'vtex.affiliates-commission-service'

import { parseAffiliateOrdersFilters } from '../../utils/filters'

export const totalizersProfileFieldResolver = async (
  args: Pick<QueryAffiliateOrdersArgs, 'filter'>,
  ctx: Context
) => {
  const { filter } = args
  const { affiliatesOrdersAggregate } = ctx.clients

  if (filter?.status === 'cancel') {
    delete filter.status
    const where = filter ? parseAffiliateOrdersFilters(filter) : ''
    const whereCanceled = where
      ? `${where} AND (status=canceled OR status=cancel)`
      : '(status=canceled OR status=cancel)'

    const canceledValue = await affiliatesOrdersAggregate.aggregateValue(
      'orderTotal',
      whereCanceled
    )

    return {
      totalCancelled: canceledValue ? canceledValue.result : 0,
      totalOngoing: 0,
      totalInvoiced: 0,
    }
  }

  if (filter?.status === 'ongoing') {
    delete filter.status
    const where = filter ? parseAffiliateOrdersFilters(filter) : ''

    const whereOngoing = where
      ? `${where} AND (status=payment-approved OR status=payment-pending OR status=on-order-completed)`
      : '(status=payment-approved OR status=payment-pending OR status=on-order-completed)'

    const onGoingValue = await affiliatesOrdersAggregate.aggregateValue(
      'orderTotal',
      whereOngoing
    )

    return {
      totalCancelled: 0,
      totalOngoing: onGoingValue ? onGoingValue.result : 0,
      totalInvoiced: 0,
    }
  }

  if (filter?.status === 'invoiced') {
    delete filter.status
    const where = filter ? parseAffiliateOrdersFilters(filter) : ''

    const whereInvoiced = where
      ? `${where} AND (status=invoiced OR status=invoice)`
      : 'status=invoiced'

    const invoicedValue = await affiliatesOrdersAggregate.aggregateValue(
      'orderTotal',
      whereInvoiced
    )

    return {
      totalCancelled: 0,
      totalOngoing: 0,
      totalInvoiced: invoicedValue ? invoicedValue.result : 0,
    }
  }

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

  return {
    totalCancelled: canceledValue?.result,
    totalOngoing: onGoingValue?.result,
    totalInvoiced: invoicedValue?.result,
  }
}
