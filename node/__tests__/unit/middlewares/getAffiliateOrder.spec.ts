import type { EventContext } from '@vtex/api'

import type { Clients } from '../../../clients'
import { getAffiliateOrder } from '../../../middlewares/getAffiliateOrder'
import { LOGGER_ERROR_MESSAGES } from '../../../utils/constants'

describe('getAffiliateOrder middleware', () => {
  const next = jest.fn()

  it('Should get the affiliateOrder', () => {
    const ctxMock = {
      state: {
        order: {
          orderId: 'orderId',
        },
      },
      clients: {
        affiliatesOrders: {
          get: jest.fn().mockResolvedValueOnce({ id: 'orderId' }),
        },
      },
      vtex: {
        logger: {
          error: jest.fn(),
        },
      },
    } as unknown as EventContext<Clients>

    return getAffiliateOrder(ctxMock, next).then(() => {
      expect(ctxMock.clients.affiliatesOrders.get).toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  it('Should throw error if any', () => {
    const ctxMock = {
      state: {
        order: {
          orderId: 'orderId',
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

    return expect(getAffiliateOrder(ctxMock, next)).rejects.toThrow(
      LOGGER_ERROR_MESSAGES.getAffiliateOrder
    )
  })
})
