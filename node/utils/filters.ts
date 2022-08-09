import type {
  AffiliateOrdersFilterInput,
  CommissionsBySkuFilterInput,
} from 'vtex.affiliates-commission-service'

export const StatusType = {
  ORDER_CREATED: 'order-created',
  PAYMENT_APPROVED: 'payment-approved',
  PAYMENT_PENDING: 'payment-pending',
  INVOICED: 'invoiced',
  CANCEL: 'cancel',
  ONGOING: 'ongoing',
}

export const parseAffiliateOrdersFilters = ({
  affiliateId,
  status,
  dateRange,
}: AffiliateOrdersFilterInput) => {
  const filterArray: string[] = []
  const affiliateIdFilter: string[] = []

  const finalStatus = StatusType[status as keyof typeof StatusType]

  if (affiliateId) {
    affiliateId.map(
      (id) => id !== '' && affiliateIdFilter.push(`affiliateId=${id}`)
    )
    const joinaffiliateIdFilter = `(${affiliateIdFilter.join(' OR ')})`

    filterArray.push(joinaffiliateIdFilter)
  }

  if (finalStatus === 'cancel') {
    filterArray.push('(status=canceled OR status=cancel)')
  } else if (finalStatus === 'ongoing') {
    filterArray.push(
      '(status=payment-approved OR status=payment-pending OR status=on-order-completed)'
    )
  } else if (finalStatus === 'invoiced') {
    filterArray.push('(status=invoiced OR status=invoice)')
  } else if (finalStatus) {
    filterArray.push(`status=${finalStatus}`)
  }

  dateRange &&
    filterArray.push(
      `(createdIn between ${dateRange.startDate} AND ${dateRange.endDate})`
    )

  return filterArray.join(' AND ')
}

export const parseCommissionsBySKUFilters = ({
  id,
  refId,
}: CommissionsBySkuFilterInput) => {
  const filterArray: string[] = []

  id && filterArray.push(`id=${id}`)
  refId && filterArray.push(`refId=${refId}`)

  return filterArray.join(' AND ')
}
