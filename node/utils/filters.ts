import type {
  AffiliateOrdersFilterInput,
  CommissionsBySkuFilterInput,
} from 'vtex.affiliates-commission-service'

export const parseAffiliateOrdersFilters = (
  { affiliateId, status, dateRange }: AffiliateOrdersFilterInput,
  affiliates?: string[]
) => {
  const filterArray: string[] = []
  const affiliateIdFilter: string[] = []

  if (affiliateId) {
    affiliates?.length
      ? affiliates.map((affiliate) => {
          return affiliateIdFilter.push(`affiliateId=${affiliate}`)
        })
      : filterArray.push(`affiliateId=${affiliateId}`)
  }

  const affiliateIdList = affiliateIdFilter.join(' OR ')

  affiliateId && affiliates?.length
    ? filterArray.push(affiliateIdList)
    : undefined

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
