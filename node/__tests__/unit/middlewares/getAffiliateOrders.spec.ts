import { getAffiliateOrders } from '../../../middlewares/getAffiliateOrders'
import { HTTP_ERRORS, SUCCESS } from '../../../utils/constants'

describe('getAffiliateOrders middleware', () => {
  const next = jest.fn()

  it('Should return error if there is no page or pageSize param', () => {
    const ctxMock = {
      query: {
        page: undefined,
        pageSize: 10,
      },
      clients: {
        affiliatesOrders: {
          searchRaw: jest.fn(),
        },
      },
      vtex: {
        route: {
          params: {
            affiliateId: '123',
          },
        },
        logger: {
          error: jest.fn(),
        },
      },
      status: 0,
      message: '',
    } as unknown as Context

    return getAffiliateOrders(ctxMock, next).then(() => {
      expect(ctxMock.status).toBe(HTTP_ERRORS.missingParams.status)
      expect(ctxMock.message).toBe(
        HTTP_ERRORS.missingParams.message(`page or pageSize`)
      )
    })
  })

  it('Should return error any when seraching the result', () => {
    const ctxMock = {
      query: {
        page: 1,
        pageSize: 10,
      },
      clients: {
        affiliatesOrders: {
          searchRaw: jest.fn().mockRejectedValueOnce(new Error('error')),
        },
      },
      vtex: {
        route: {
          params: {
            affiliateId: '123',
          },
        },
        logger: {
          error: jest.fn(),
        },
      },
      status: 0,
      message: '',
    } as unknown as Context

    return getAffiliateOrders(ctxMock, next).then(() => {
      expect(ctxMock.status).toBe(HTTP_ERRORS.serverError.status)
      expect(ctxMock.message).toBe(HTTP_ERRORS.serverError.message)
    })
  })

  it('Should return the results if everything is ok', () => {
    const ctxMock = {
      query: {
        page: 1,
        pageSize: 10,
      },
      clients: {
        affiliatesOrders: {
          searchRaw: jest
            .fn()
            .mockResolvedValueOnce({ id: '123', affiliateId: '123' }),
        },
      },
      vtex: {
        route: {
          params: {
            affiliateId: '123',
          },
        },
        logger: {
          error: jest.fn(),
        },
      },
      status: 0,
      message: '',
    } as unknown as Context

    return getAffiliateOrders(ctxMock, next).then(() => {
      expect(ctxMock.status).toBe(SUCCESS)
      expect(ctxMock.body).toStrictEqual({ id: '123', affiliateId: '123' })
    })
  })
})
