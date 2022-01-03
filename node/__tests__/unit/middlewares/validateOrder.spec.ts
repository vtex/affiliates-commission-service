import type { EventContext } from '@vtex/api'

import type { Clients } from '../../../clients'
import { validateOrder } from '../../../middlewares/validateOrder'
import { CUSTOM_DATA_APP_ID } from '../../../utils/constants'

describe('validateOrder middleware', () => {
  const next = jest.fn()

  it('Should add order and customData to state if everything is ok', () => {
    const ctxMock = {
      body: {
        orderId: 'orderId',
      },
      clients: {
        checkout: {
          order: jest.fn().mockResolvedValueOnce({
            customData: {
              customApps: [
                {
                  id: CUSTOM_DATA_APP_ID,
                },
              ],
            },
          }),
        },
      },
      state: {},
      vtex: {
        logger: {
          error: jest.fn(),
        },
      },
    } as unknown as EventContext<Clients>

    return validateOrder(ctxMock, next).then(() => {
      expect(ctxMock.state).toHaveProperty('order')
      expect(ctxMock.state).toHaveProperty('customData')
    })
  })

  it('Should just return if no affiliates customData was found', () => {
    const ctxMock = {
      body: {
        orderId: 'orderId',
      },
      clients: {
        checkout: {
          order: jest.fn().mockResolvedValueOnce({
            customData: {
              customApps: [
                {
                  id: 'Other app',
                },
              ],
            },
          }),
        },
      },
      state: {},
      vtex: {
        logger: {
          error: jest.fn(),
        },
      },
    } as unknown as EventContext<Clients>

    return validateOrder(ctxMock, next).then(() => {
      expect(ctxMock.state).not.toHaveProperty('order')
      expect(ctxMock.state).not.toHaveProperty('customData')
    })
  })

  it('Should throw an error if any', () => {
    const ctxMock = {
      body: {
        orderId: 'orderId',
      },
      clients: {
        checkout: {
          order: jest.fn().mockRejectedValueOnce(new Error('Error')),
        },
      },
      state: {},
      vtex: {
        logger: {
          error: jest.fn(),
        },
      },
    } as unknown as EventContext<Clients>

    return expect(validateOrder(ctxMock, next)).rejects.toThrow(
      'Error validating the order'
    )
  })
})
