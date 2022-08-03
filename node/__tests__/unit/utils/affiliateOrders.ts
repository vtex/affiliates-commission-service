import { parseAffiliateOrdersFilters } from '../../../utils/filters'

describe('parseAffiliateOrdersFilters', () => {
  const mockedFilter = {
    affiliateId: ['mockedAffiliateId'],
    status: 'INVOICED',
    dateRange: {
      startDate: 'mockedStartDate',
      endDate: 'mockedEndDate',
    },
  }

  it('should return the right filter', () => {
    expect(parseAffiliateOrdersFilters(mockedFilter)).toBe(
      '(affiliateId=mockedAffiliateId) AND status=invoiced AND (createdIn between mockedStartDate AND mockedEndDate)'
    )
  })

  it('should return the filter with no status', () => {
    mockedFilter.status = 'BAD_STATUS'
    expect(parseAffiliateOrdersFilters(mockedFilter)).toBe(
      '(affiliateId=mockedAffiliateId) AND (createdIn between mockedStartDate AND mockedEndDate)'
    )
  })
})
