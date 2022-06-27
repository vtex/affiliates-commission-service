import type {
  AffiliateOrdersFilterInput,
  CommissionsBySkuFilterInput,
} from 'vtex.affiliates-commission-service'

export const parseAffiliateOrdersFilters = async (
  { affiliateId, status, dateRange }: AffiliateOrdersFilterInput,
  affiliates?: Context['clients']['affiliates']
) => {
  const filterArray: string[] = []
  const affiliateIdFilter: string[] = []
  const fields = ['_all']

  let MD_TOKEN

  const affiliateList = await affiliates?.scroll({
    fields,
    where: `name=*${affiliateId}*`,
    mdToken: MD_TOKEN !== undefined ? MD_TOKEN : undefined,
  })

  MD_TOKEN = MD_TOKEN !== undefined ? MD_TOKEN : affiliateList?.mdToken

  const affiliatesIdList = affiliateList?.data?.map((affiliate) => affiliate.id)

  if (affiliateId) {
    affiliatesIdList?.length
      ? affiliatesIdList.map((affiliate) => {
          return affiliateIdFilter.push(`affiliateId=${affiliate}`)
        })
      : filterArray.push(`affiliateId=${affiliateId}`)
  }

  const affiliateIdList = affiliateIdFilter.join(' OR ')

  affiliateId && affiliatesIdList?.length
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
