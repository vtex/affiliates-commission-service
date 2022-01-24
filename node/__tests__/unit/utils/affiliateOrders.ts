import { parseAffiliateOrdersFilters } from '../../../utils/affiliateOrders'

describe('parseAffiliateOrdersFilters', () => {
  const mockedFilter = {
    affiliateId: 'mockedAffiliateId',
    status: 'mockedStatus',
    dateRange: {
      startDate: 'mockedStartDate',
      endDate: 'mockedEndDate',
    },
  }

  it('should return the right filter', () => {
    expect(parseAffiliateOrdersFilters(mockedFilter)).toBe(
      'affiliateId=mockedAffiliateId AND status=mockedStatus AND (createdIn between mockedStartDate AND mockedEndDate)'
    )
  })
})
