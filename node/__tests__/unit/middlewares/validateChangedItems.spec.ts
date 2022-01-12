import type { EventContext } from '@vtex/api'

import type { Clients } from '../../../clients'
import { validateChangedItems } from '../../../middlewares/validateChangedItems'
import {
  INVOICED_STATUS,
  LOGGER_ERROR_MESSAGES,
} from '../../../utils/constants'

describe('validateChangedItemsMiddleware', () => {
  const next = jest.fn()

  it('Should return if affiliateOrder status is already invoiced', () => {
    const ctxMock = {
      state: {
        order: {},
        affiliateOrder: {
          status: INVOICED_STATUS,
        },
      },
      clients: {
        catalog: {
          getSkuContext: jest.fn(),
        },
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

    return validateChangedItems(ctxMock, next).then(() => {
      expect(next).not.toHaveBeenCalled()
    })
  })

  it('Should not update the affiliateOrder if there is no changeData', () => {
    const ctxMock = {
      state: {
        order: {
          state: INVOICED_STATUS,
          changeData: null,
        },
        affiliateOrder: {
          status: 'payment_approved',
        },
      },
      clients: {
        catalog: {
          getSkuContext: jest.fn(),
        },
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

    return validateChangedItems(ctxMock, next).then(() => {
      expect(ctxMock.state.affiliateOrder).toMatchObject({
        status: INVOICED_STATUS,
      })
    })
  })

  it('Should add newItems if any', () => {
    const ctxMock = {
      state: {
        order: {
          state: INVOICED_STATUS,
          changeData: {
            changesData: [
              {
                reason: 'Adiciona produto diferente',
                discountValue: 0,
                incrementValue: 2000,
                itemsAdded: [
                  {
                    id: '1',
                    name: 'Camisa de Escola',
                    quantity: 1,
                    price: 2000,
                    unitMultiplier: 1.0,
                  },
                ],
                itemsRemoved: [],
                receipt: {
                  date: '2022-01-06T17:31:05.3908149+00:00',
                  orderId: '1201371695961-01',
                  receipt: 'd5796146-d3c2-4ae1-a806-e73180815c95',
                },
              },
              {
                reason:
                  'Adiciona quantidade de produto existente com preco diferente',
                discountValue: 0,
                incrementValue: 1000,
                itemsAdded: [
                  {
                    id: '6',
                    name: 'Estojo Pequeno Preto',
                    quantity: 1,
                    price: 1000,
                    unitMultiplier: 1.0,
                  },
                ],
                itemsRemoved: [],
                receipt: {
                  date: '2022-01-06T17:31:48.1099020+00:00',
                  orderId: '1201371695961-01',
                  receipt: '624b2ab3-fcac-4b28-8523-d6dd3bd6cf2d',
                },
              },
              {
                reason:
                  'Adiciona quantidade de produto existente com mesmo preco',
                discountValue: 0,
                incrementValue: 5500,
                itemsAdded: [
                  {
                    id: '6',
                    name: 'Estojo Pequeno Preto',
                    quantity: 1,
                    price: 5500,
                    unitMultiplier: 1.0,
                  },
                ],
                itemsRemoved: [],
                receipt: {
                  date: '2022-01-06T17:32:14.1715305+00:00',
                  orderId: '1201371695961-01',
                  receipt: 'ca386ad1-b3d7-4fd3-bd9e-cd16438ed6fd',
                },
              },
            ],
          },
        },
        affiliateOrder: {
          status: 'payment_approved',
          orderItems: [
            {
              skuId: '6',
              skuName: 'Estojo Pequeno Preto',
              skuImageUrl: 'url',
              price: 5500,
              quantity: 2,
              commission: 5,
            },
          ],
          orderTotal: 11000,
          orderTotalCommission: 550,
        },
      },
      clients: {
        catalog: {
          getSkuContext: jest.fn().mockResolvedValueOnce({
            Id: 1,
            SkuName: 'name',
            ImageUrl: 'url',
          }),
        },
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

    return validateChangedItems(ctxMock, next).then(() => {
      expect(ctxMock.state.affiliateOrder.orderItems).toHaveLength(3)
      expect(next).toHaveBeenCalled()
    })
  })

  it('Should just do nothing if changes have no itemsAdded or Removed', () => {
    const ctxMock = {
      state: {
        order: {
          state: INVOICED_STATUS,
          changeData: {
            changesData: [
              {
                reason: 'Adiciona produto diferente',
                discountValue: 0,
                incrementValue: 2000,
                itemsAdded: [],
                itemsRemoved: [],
                receipt: {
                  date: '2022-01-06T17:31:05.3908149+00:00',
                  orderId: '1201371695961-01',
                  receipt: 'd5796146-d3c2-4ae1-a806-e73180815c95',
                },
              },
              {
                reason:
                  'Adiciona quantidade de produto existente com preco diferente',
                discountValue: 0,
                incrementValue: 1000,
                itemsAdded: [],
                itemsRemoved: [],
                receipt: {
                  date: '2022-01-06T17:31:48.1099020+00:00',
                  orderId: '1201371695961-01',
                  receipt: '624b2ab3-fcac-4b28-8523-d6dd3bd6cf2d',
                },
              },
              {
                reason:
                  'Adiciona quantidade de produto existente com mesmo preco',
                discountValue: 0,
                incrementValue: 5500,
                itemsAdded: [],
                itemsRemoved: [],
                receipt: {
                  date: '2022-01-06T17:32:14.1715305+00:00',
                  orderId: '1201371695961-01',
                  receipt: 'ca386ad1-b3d7-4fd3-bd9e-cd16438ed6fd',
                },
              },
            ],
          },
        },
        affiliateOrder: {
          status: 'payment_approved',
          orderItems: [
            {
              skuId: '6',
              skuName: 'Estojo Pequeno Preto',
              skuImageUrl: 'url',
              price: 5500,
              quantity: 2,
              commission: 5,
            },
          ],
          orderTotal: 11000,
          orderTotalCommission: 550,
        },
      },
      clients: {
        catalog: {
          getSkuContext: jest.fn().mockResolvedValueOnce({
            Id: 1,
            SkuName: 'name',
            ImageUrl: 'url',
          }),
        },
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

    return validateChangedItems(ctxMock, next).then(() => {
      expect(ctxMock.state.affiliateOrder.orderItems).toHaveLength(1)
      expect(next).toHaveBeenCalled()
    })
  })

  it('Should remove items in itemsRemoved', () => {
    const ctxMock = {
      state: {
        order: {
          state: INVOICED_STATUS,
          changeData: {
            changesData: [
              {
                reason:
                  'Adiciona quantidade de produto existente com mesmo preco',
                discountValue: 5500,
                incrementValue: 0,
                itemsAdded: [],
                itemsRemoved: [
                  {
                    id: '6',
                    name: 'Estojo Pequeno Preto',
                    quantity: 1,
                    price: 5500,
                    unitMultiplier: 1.0,
                  },
                ],
                receipt: {
                  date: '2022-01-06T17:32:14.1715305+00:00',
                  orderId: '1201371695961-01',
                  receipt: 'ca386ad1-b3d7-4fd3-bd9e-cd16438ed6fd',
                },
              },
            ],
          },
        },
        affiliateOrder: {
          status: 'payment_approved',
          orderItems: [
            {
              skuId: '6',
              skuName: 'Estojo Pequeno Preto',
              skuImageUrl: 'url',
              price: 5500,
              quantity: 2,
              commission: 5,
            },
          ],
          orderTotal: 11000,
          orderTotalCommission: 550,
        },
      },
      clients: {
        catalog: {
          getSkuContext: jest.fn(),
        },
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

    return validateChangedItems(ctxMock, next).then(() => {
      expect(ctxMock.state.affiliateOrder.orderItems).toHaveLength(1)
      expect(next).toHaveBeenCalled()
    })
  })

  it('Should throw an error if any', () => {
    const ctxMock = {
      state: {
        order: {
          state: INVOICED_STATUS,
          changeData: {
            changesData: [
              {
                reason:
                  'Adiciona quantidade de produto existente com mesmo preco',
                discountValue: 5500,
                incrementValue: 0,
                itemsAdded: [],
                itemsRemoved: [
                  {
                    id: '6',
                    name: 'Estojo Pequeno Preto',
                    quantity: 1,
                    price: 5500,
                    unitMultiplier: 1.0,
                  },
                ],
                receipt: {
                  date: '2022-01-06T17:32:14.1715305+00:00',
                  orderId: '1201371695961-01',
                  receipt: 'ca386ad1-b3d7-4fd3-bd9e-cd16438ed6fd',
                },
              },
            ],
          },
        },
        affiliateOrder: {
          status: 'payment_approved',
          orderItems: null,
          orderTotal: 11000,
          orderTotalCommission: 550,
        },
      },
      clients: {
        catalog: {
          getSkuContext: jest.fn(),
        },
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

    return expect(validateChangedItems(ctxMock, next)).rejects.toThrow(
      LOGGER_ERROR_MESSAGES.validateChangedItems
    )
  })
})
