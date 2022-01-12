import type { EventContext } from '@vtex/api'

import type { Clients } from '../../../clients'
import { parseData } from '../../../middlewares/parseData'
import {
  CUSTOM_DATA_FIELD_ID,
  LOGGER_ERROR_MESSAGES,
} from '../../../utils/constants'

describe('parseData middleware', () => {
  const next = jest.fn()

  it('Should have the affiliateOrder on state if everything is ok', () => {
    const ctxMock = {
      state: {
        order: {
          orderId: '123',
          state: 'orderState',
          clientProfileData: {
            email: 'clientEmail@email.com',
          },
          creationDate: 'date',
          totals: [{ id: 'Items', value: 100 }],
          items: [
            {
              id: '1',
              skuName: 'skuName',
              imageUrl: 'url',
              sellingPrice: 100,
              quantity: 1,
            },
          ],
        },
        customData: {
          fields: {
            [CUSTOM_DATA_FIELD_ID]: 'affiliateId',
          },
        },
      },
      clients: {
        commissionBySKU: {
          get: jest.fn().mockResolvedValueOnce([{ id: '1', commission: 10 }]),
        },
      },
      vtex: {
        logger: {
          error: jest.fn(),
        },
      },
    } as unknown as EventContext<Clients>

    return parseData(ctxMock, next).then(() => {
      expect(ctxMock.state).toHaveProperty('affiliateOrder')
    })
  })

  it('Should throw error if any', () => {
    const ctxMock = {
      state: {
        order: {
          orderId: '123',
          state: 'orderState',
          clientProfileData: {
            email: 'clientEmail@email.com',
          },
          creationDate: 'date',
          totals: null,
          items: [
            {
              id: '1',
              skuName: 'skuName',
              imageUrl: 'url',
              sellingPrice: 100,
              quantity: 1,
            },
          ],
        },
        customData: {
          fields: {
            [CUSTOM_DATA_FIELD_ID]: 'affiliateId',
          },
        },
      },
      clients: {
        commissionBySKU: {
          get: jest.fn().mockResolvedValueOnce([{ id: '1', commission: 10 }]),
        },
      },
      vtex: {
        logger: {
          error: jest.fn(),
        },
      },
    } as unknown as EventContext<Clients>

    return expect(parseData(ctxMock, next)).rejects.toThrow(
      LOGGER_ERROR_MESSAGES.parseData
    )
  })
})
