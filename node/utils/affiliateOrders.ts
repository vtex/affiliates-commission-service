import type { AffiliateOrdersFilterInput } from 'vtex.affiliates-commission-service'

export const parseAffiliateOrdersFilters = ({
  affiliateId,
  status,
  dateRange,
}: AffiliateOrdersFilterInput) => {
  const filterArray: string[] = []

  affiliateId && filterArray.push(`affiliateId=${affiliateId}`)
  status && filterArray.push(`status=${status}`)
  dateRange &&
    filterArray.push(
      `(createdIn between ${dateRange.startDate} AND ${dateRange.endDate})`
    )

  return filterArray.join(' AND ')
}
