import { parseAffiliateOrdersFilters } from '../../../utils/filters'

describe('parseAffiliateOrdersFilters', () => {
  const mockedContext = {
    clients: {
      affiliates: {
        search: jest.fn(),
      },
    },
  } as unknown as Context

  const mockedFilter = {
    affiliateId: 'mockedAffiliateId',
    status: 'mockedStatus',
    dateRange: {
      startDate: 'mockedStartDate',
      endDate: 'mockedEndDate',
    },
  }

  it('should return the right filter', () => {
    expect(
      parseAffiliateOrdersFilters(
        mockedFilter,
        mockedContext.clients.affiliates
      )
    ).toBe(
      'affiliateId=mockedAffiliateId AND status=mockedStatus AND (createdIn between mockedStartDate AND mockedEndDate)'
    )
  })
})
