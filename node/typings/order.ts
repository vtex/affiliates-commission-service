import type { OrderItemDetailResponse } from '@vtex/clients'

export interface OrderItemDetailResponseExtended
  extends OrderItemDetailResponse {
  skuName: string
  state: string
  changeData?: {
    changesData: ChangesData[]
  }
}

export type ChangesItem = {
  id: string
  name: string
  quantity: number
  price: number
  unitMultiplier: number
}

export interface ChangesData {
  reason: string
  discountValue: number
  incrementValue: number
  itemsAdded: ChangesItem[]
  itemsRemoved: ChangesItem[]
  receipt: {
    date: string
    orderId: string
    receipt: string
  }
}
