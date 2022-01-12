import co_body from 'co-body'

import { setCommissionBySKU } from '../../../../middlewares/commission/setCommissionBySKU'
import { CommissionBySKUService } from '../../../../services/CommissionBySKUService'
import { SUCCESS } from '../../../../utils/constants'

describe('setCommissionBySKU', () => {
  const jsonSpy = jest
    .spyOn(co_body, 'json')
    .mockImplementation((body) => Promise.resolve(body))

  const next = jest.fn()

  const mockInput = [
    {
      id: '1',
      commission: 1,
    },
    {
      id: '2',
      commission: 2,
    },
    {
      id: '3',
      commission: 3,
    },
  ]

  const mockOutput = { errors: [] }

  const mockCtx = {
    req: mockInput,
    clients: {
      commissionBySKU: {
        saveOrUpdate: jest.fn(),
      },
    },
    vtex: {
      logger: {
        error: jest.fn(),
      },
    },
  } as unknown as Context

  afterEach(() => {
    next.mockClear()
  })

  it('should read input and call saveOrUpdate service operation', async () => {
    const serviceSpy = jest
      .spyOn(CommissionBySKUService.prototype, 'saveOrUpdate')
      .mockResolvedValue(mockOutput)

    await setCommissionBySKU(mockCtx, next)

    expect(jsonSpy).toHaveBeenCalledWith(mockCtx.req)
    expect(serviceSpy).toHaveBeenCalled()
  })

  it('should update context status and message and call next if operation is successful', async () => {
    jest
      .spyOn(CommissionBySKUService.prototype, 'saveOrUpdate')
      .mockResolvedValue(mockOutput)

    await setCommissionBySKU(mockCtx, next)

    expect(mockCtx.status).toBe(SUCCESS)
    expect(mockCtx.message).toBe(JSON.stringify(mockOutput))
    expect(next).toHaveBeenCalled()
  })

  it('should throw and error and not call next if operation fails', async () => {
    jest
      .spyOn(CommissionBySKUService.prototype, 'saveOrUpdate')
      .mockRejectedValue(new Error('Error'))

    await expect(setCommissionBySKU(mockCtx, next)).rejects.toThrow()
    expect(next).not.toHaveBeenCalled()
  })
})
