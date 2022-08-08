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

  it('should return the right filter and the all invoiced status', () => {
    expect(parseAffiliateOrdersFilters(mockedFilter)).toBe(
      '(affiliateId=mockedAffiliateId) AND (status=invoiced OR status=invoice) AND (createdIn between mockedStartDate AND mockedEndDate)'
    )
  })

  it('should return the right filter and the all cancel status', () => {
    mockedFilter.status = 'CANCEL'

    expect(parseAffiliateOrdersFilters(mockedFilter)).toBe(
      '(affiliateId=mockedAffiliateId) AND (status=canceled OR status=cancel) AND (createdIn between mockedStartDate AND mockedEndDate)'
    )
  })

  it('should return the right filter and the all ongoing status', () => {
    mockedFilter.status = 'ONGOING'

    expect(parseAffiliateOrdersFilters(mockedFilter)).toBe(
      '(affiliateId=mockedAffiliateId) AND (status=payment-approved OR status=payment-pending OR status=on-order-completed) AND (createdIn between mockedStartDate AND mockedEndDate)'
    )
  })

  it('should return the filter with no status', () => {
    mockedFilter.status = 'BAD_STATUS'

    expect(parseAffiliateOrdersFilters(mockedFilter)).toBe(
      '(affiliateId=mockedAffiliateId) AND (createdIn between mockedStartDate AND mockedEndDate)'
    )
  })
})
