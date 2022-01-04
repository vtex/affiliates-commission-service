import type { EventContext } from '@vtex/api'

import type { Clients } from '../../../clients'
import { updateOrderStatus } from '../../../middlewares/updateOrderStatus'
import {
  CUSTOM_DATA_FIELD_ID,
  LOGGER_ERROR_MESSAGES,
} from '../../../utils/constants'

describe('updateOrderStatus middleware', () => {
  const next = jest.fn()

  it('Should update the order status', () => {
    const ctxMock = {
      state: {
        order: {
          orderId: '123',
          state: 'updatedStatus',
          clientProfileData: {
            email: 'email@email.com',
          },
        },
        customData: {
          fields: {
            [CUSTOM_DATA_FIELD_ID]: 'affiliateId',
          },
        },
      },
      clients: {
        affiliatesOrders: {
          update: jest.fn().mockResolvedValueOnce(null),
        },
      },
      vtex: {
        logger: {
          error: jest.fn(),
        },
      },
    } as unknown as EventContext<Clients>

    return updateOrderStatus(ctxMock, next).then(() => {
      expect(ctxMock.clients.affiliatesOrders.update).toHaveBeenCalledWith(
        '123',
        {
          status: 'updatedStatus',
          userEmail: 'email@email.com',
          affiliateId: 'affiliateId',
        }
      )
    })
  })

  it('Should throw error if any', () => {
    const ctxMock = {
      state: {
        order: {
          orderId: '123',
          state: 'updatedStatus',
          clientProfileData: {
            email: 'email@email.com',
          },
        },
        customData: {
          fields: {
            [CUSTOM_DATA_FIELD_ID]: 'affiliateId',
          },
        },
      },
      clients: {
        affiliatesOrders: {
          update: jest.fn().mockRejectedValueOnce(new Error('Error')),
        },
      },
      vtex: {
        logger: {
          error: jest.fn(),
        },
      },
    } as unknown as EventContext<Clients>

    return expect(updateOrderStatus(ctxMock, next)).rejects.toThrow(
      LOGGER_ERROR_MESSAGES.updateOrderStatus
    )
  })
})
