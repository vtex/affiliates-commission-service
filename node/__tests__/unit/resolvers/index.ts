import type { QueryAffiliateOrdersArgs } from 'vtex.affiliates-commission-service'

import { resolvers } from '../../../resolvers'
import { parseAffiliateOrdersFilters } from '../../../utils/filters'

const {
  Query: { affiliateOrders },
} = resolvers

describe('affiliateOrders', () => {
  const mockedContext = {
    clients: {
      affiliatesOrders: {
        searchRaw: jest.fn(),
      },
    },
  } as unknown as Context

  const mockedArgs = {
    page: 1,
    pageSize: 100,
    filter: {
      affiliateId: 'mockedAffiliateId',
    },
    sorting: {
      field: 'orderTotal',
      order: 'DESC',
    },
  } as QueryAffiliateOrdersArgs

  it('should call searchRaw with the right arguments', async () => {
    await affiliateOrders(null, mockedArgs, mockedContext)

    expect(
      mockedContext.clients.affiliatesOrders.searchRaw
    ).toHaveBeenCalledWith(
      {
        page: mockedArgs.page,
        pageSize: mockedArgs.pageSize,
      },
      ['_all'],
      'orderTotal DESC',
      parseAffiliateOrdersFilters({ affiliateId: 'mockedAffiliateId' })
    )
  })
})
