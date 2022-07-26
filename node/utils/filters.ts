import type {
  AffiliateOrdersFilterInput,
  CommissionsBySkuFilterInput,
} from 'vtex.affiliates-commission-service'

export const parseAffiliateOrdersFilters = ({
  affiliateId,
  status,
  dateRange,
}: AffiliateOrdersFilterInput) => {
  const filterArray: string[] = []
  const affiliateIdFilter: string[] = []

  if (affiliateId) {
    affiliateId.map((id) => affiliateIdFilter.push(`affiliateId=${id}`))
    filterArray.push(affiliateIdFilter.join(' OR '))
  }

  if (status === 'cancel') {
    filterArray.push('(status=canceled OR status=cancel)')
  } else if (status === 'ongoing') {
    filterArray.push(
      '(status=payment-approved OR status=payment-pending OR status=on-order-completed)'
    )
  } else if (status) {
    filterArray.push(`status=${status}`)
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
