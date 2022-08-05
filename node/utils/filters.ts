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
    affiliateId.map(
      (id) => id !== '' && affiliateIdFilter.push(`affiliateId=${id}`)
    )
    affiliateIdFilter.length !== 0 &&
      filterArray.push(affiliateIdFilter.join(' OR '))
  }

  status && filterArray.push(`status=${status}`)
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
