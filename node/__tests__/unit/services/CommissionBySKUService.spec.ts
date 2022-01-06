import {
  CommissionBySKUService,
  commissionServiceFieldsForMDGet,
} from '../../../services/CommissionBySKUService'
import type {
  CommissionClient,
  CommissionServiceInputData,
} from '../../../typings/commission'

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
  {
    id: '4',
    commission: 4,
  },
] as CommissionServiceInputData

const mockOutput = {
  data: [
    {
      id: '1',
      commission: 1,
    },
    {
      id: '2',
      commission: 2,
    },
  ],
  errors: [
    {
      id: '3',
      message: 'No changes',
    },
    {
      id: '4',
      message: 'Internal server error',
    },
  ],
}

const mockPromiseResultById = (id: string) => {
  if (id === '1') {
    return Promise.resolve(mockOutput.data[0])
  }

  if (id === '2') {
    return Promise.resolve(mockOutput.data[1])
  }

  if (id === '3') {
    return Promise.reject(mockOutput.errors[0])
  }

  if (id === '4') {
    return Promise.reject(mockOutput.errors[1])
  }

  return undefined
}

const mockClient = {
  get: jest.fn().mockImplementation(mockPromiseResultById),
  saveOrUpdate: jest
    .fn()
    .mockImplementation(({ id }) => mockPromiseResultById(id)),
  delete: jest.fn().mockImplementation(mockPromiseResultById),
} as unknown as CommissionClient

const commissionBySKUService = new CommissionBySKUService(mockClient, mockInput)

describe('CommissionBySKUService', () => {
  describe('get', () => {
    it('should call client method get for every id in input', async () => {
      await commissionBySKUService.get()

      mockInput.forEach(({ id }) => {
        expect(mockClient.get).toHaveBeenCalledWith(
          id,
          commissionServiceFieldsForMDGet
        )
      })
    })
    it('should list all commission data or error messages, if any', async () => {
      const result = await commissionBySKUService.get()

      expect(result).toEqual({
        data: mockOutput.data,
        errors: mockOutput.errors,
      })
    })
  })

  describe('saveOrUpdate', () => {
    it('should call client method saveOrUpdate with the commission info for all elements in the provided data', async () => {
      await commissionBySKUService.saveOrUpdate()

      mockInput.forEach((info) => {
        expect(mockClient.saveOrUpdate).toHaveBeenCalledWith(info)
      })
    })
    it('should list all error messages, if any', async () => {
      const result = await commissionBySKUService.saveOrUpdate()

      expect(result).toEqual({
        errors: mockOutput.errors,
      })
    })
  })

  describe('delete', () => {
    it('should call client method delete for every id in input', async () => {
      await commissionBySKUService.delete()

      mockInput.forEach(({ id }) => {
        expect(mockClient.delete).toHaveBeenCalledWith(id)
      })
    })
    it('should list all error messages, if any', async () => {
      const result = await commissionBySKUService.delete()

      expect(result).toEqual({
        errors: mockOutput.errors,
      })
    })
  })
})
