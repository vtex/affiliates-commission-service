import { authenticateRequest } from '../../../middlewares/authenticateRequest'
import {
  APP_KEY_HEADER,
  APP_TOKEN_HEADER,
  HTTP_ERRORS,
} from '../../../utils/constants'

describe('authenticateRequest middleware', () => {
  const next = jest.fn()

  it('Should throw error if no appToken or appKey was passed', () => {
    const ctxMock = {
      headers: {},
      clients: {
        authentication: {
          getAuthToken: jest.fn(),
        },
        licenseManager: {
          canAccessResource: jest.fn(),
        },
      },
      status: 0,
      message: '',
    } as unknown as Context

    return authenticateRequest(ctxMock, next).then(() => {
      expect(ctxMock.status).toBe(HTTP_ERRORS.missingAuthentication.status)
      expect(ctxMock.message).toBe(HTTP_ERRORS.missingAuthentication.message)
    })
  })

  it('Should throw error if token has no access to masterdata', () => {
    const ctxMock = {
      headers: {
        [APP_KEY_HEADER]: 'appKey',
        [APP_TOKEN_HEADER]: 'appToken',
      },
      clients: {
        authentication: {
          getAuthToken: jest.fn().mockResolvedValueOnce({ token: 'token' }),
        },
        licenseManager: {
          canAccessResource: jest.fn().mockResolvedValueOnce(false),
        },
      },
      status: 0,
      message: '',
    } as unknown as Context

    return authenticateRequest(ctxMock, next).then(() => {
      expect(ctxMock.status).toBe(HTTP_ERRORS.forbidden.status)
      expect(ctxMock.message).toBe(HTTP_ERRORS.forbidden.message)
    })
  })

  it('Should call next if everything is ok', () => {
    const ctxMock = {
      headers: {
        [APP_KEY_HEADER]: 'appKey',
        [APP_TOKEN_HEADER]: 'appToken',
      },
      clients: {
        authentication: {
          getAuthToken: jest.fn().mockResolvedValueOnce({ token: 'token' }),
        },
        licenseManager: {
          canAccessResource: jest.fn().mockResolvedValueOnce(true),
        },
      },
    } as unknown as Context

    return authenticateRequest(ctxMock, next).then(() => {
      expect(next).toHaveBeenCalled()
    })
  })
})
