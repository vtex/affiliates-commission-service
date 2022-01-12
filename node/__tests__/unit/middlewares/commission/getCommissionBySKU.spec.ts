import { getCommissionBySKU } from '../../../../middlewares/commission/getCommissionBySKU'
import { CommissionBySKUService } from '../../../../services/CommissionBySKUService'

describe('getCommissionBySKU', () => {
  const next = jest.fn()

  const mockInput = [
    {
      id: '1',
    },
  ]

  const mockOutput = { data: [{ id: 1, commission: 1 }], errors: [] }

  const mockCtx = {
    state: mockInput,
    clients: {
      commissionBySKU: {
        get: jest.fn(),
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

  it('should call get service operation', async () => {
    const serviceSpy = jest
      .spyOn(CommissionBySKUService.prototype, 'get')
      .mockResolvedValue(mockOutput)

    await getCommissionBySKU(mockCtx, next)

    expect(serviceSpy).toHaveBeenCalled()
  })

  it('should update context status and message and call next if operation is successful', async () => {
    jest
      .spyOn(CommissionBySKUService.prototype, 'get')
      .mockResolvedValue(mockOutput)

    await getCommissionBySKU(mockCtx, next)

    expect(mockCtx.status).toBe(200)
    expect(mockCtx.message).toBe(JSON.stringify(mockOutput))
    expect(next).toHaveBeenCalled()
  })

  it('should throw and error and not call next if operation fails', async () => {
    jest
      .spyOn(CommissionBySKUService.prototype, 'get')
      .mockRejectedValue(new Error('Error'))

    await expect(getCommissionBySKU(mockCtx, next)).rejects.toThrow()
    expect(next).not.toHaveBeenCalled()
  })
})
