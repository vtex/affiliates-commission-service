import { getAffiliateOrdersAggregate } from '../../../middlewares/getAffiliateOrdersAggregate'
import { HTTP_ERRORS, SUCCESS } from '../../../utils/constants'

describe('getAffiliateOrdersMiddleware', () => {
  const nextMock = jest.fn()

  it('Should return error if required query params are missing', () => {
    const mockCtx = {
      clients: {
        affiliatesOrdersAggregate: {},
      },
      vtex: {
        route: {
          params: {
            affiliateId: 'validId',
          },
        },
        logger: {},
      },
      query: {
        field: 'validField',
        startDate: 'validDate',
        status: 'validStatus',
      },
      status: '',
      body: {},
      message: '',
    } as unknown as Context

    return getAffiliateOrdersAggregate(mockCtx, nextMock).then(() => {
      expect(mockCtx.status).toBe(HTTP_ERRORS.missingParams.status)
      expect(mockCtx.message).toBe(
        HTTP_ERRORS.missingParams.message(`fields or startDate or endDate`)
      )
    })
  })

  it('Should return the aggregate value if everything is ok', () => {
    const mockCtx = {
      clients: {
        affiliatesOrdersAggregate: {
          aggregateValue: jest.fn(),
        },
      },
      vtex: {
        route: {
          params: {
            affiliateId: 'validId',
          },
        },
        logger: {},
      },
      query: {
        field: 'validField',
        startDate: 'validDate',
        endDate: 'validDate',
        status: 'validStatus',
      },
      status: '',
      body: {},
      message: '',
    } as unknown as Context

    return getAffiliateOrdersAggregate(mockCtx, nextMock).then(() => {
      expect(mockCtx.status).toBe(SUCCESS)
    })
  })

  it('Should return error if any happen', () => {
    const mockCtx = {
      clients: {
        affiliatesOrdersAggregate: {
          aggregateValue: jest.fn().mockRejectedValueOnce(new Error('error')),
        },
      },
      vtex: {
        route: {
          params: {
            affiliateId: 'validId',
          },
        },
        logger: {
          error: jest.fn(),
        },
      },
      query: {
        field: 'validField',
        startDate: 'validDate',
        endDate: 'validDate',
        status: 'validStatus',
      },
      status: '',
      body: {},
      message: '',
    } as unknown as Context

    return getAffiliateOrdersAggregate(mockCtx, nextMock).then(() => {
      expect(mockCtx.status).toBe(HTTP_ERRORS.serverError.status)
      expect(mockCtx.message).toBe(HTTP_ERRORS.serverError.message)
    })
  })
})
