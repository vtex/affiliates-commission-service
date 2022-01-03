import type { EventContext } from '@vtex/api'

import type { Clients } from '../../../clients'
import { saveOrUpdateAffiliateOrder } from '../../../middlewares/saveOrUpdateAffiliateOrder'

describe('saveOrUpdateAffiliateOrder middleware', () => {
  const next = jest.fn()

  it('Should save the affiliateOrder', () => {
    const ctxMock = {
      state: {
        affiliateOrder: {
          id: 'orderId',
          affiliateId: 'affiliateId',
          orderTotal: 100,
          orderTotalCommission: 10,
        },
      },
      clients: {
        affiliatesOrders: {
          saveOrUpdate: jest.fn().mockResolvedValueOnce(true),
        },
      },
      vtex: {
        logger: {
          error: jest.fn(),
        },
      },
    } as unknown as EventContext<Clients>

    return saveOrUpdateAffiliateOrder(ctxMock, next).then(() => {
      expect(ctxMock.clients.affiliatesOrders.saveOrUpdate).toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  it('Should throw error if any', () => {
    const ctxMock = {
      state: {
        affiliateOrder: {
          id: 'orderId',
          affiliateId: 'affiliateId',
          orderTotal: 100,
          orderTotalCommission: 10,
        },
      },
      clients: {
        affiliatesOrders: {
          saveOrUpdate: jest.fn().mockRejectedValueOnce(new Error('Error')),
        },
      },
      vtex: {
        logger: {
          error: jest.fn(),
        },
      },
    } as unknown as EventContext<Clients>

    return expect(saveOrUpdateAffiliateOrder(ctxMock, next)).rejects.toThrow(
      'Error saving or updating the affiliate order'
    )
  })
})
