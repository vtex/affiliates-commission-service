import type { OrderItemDetailResponse } from '@vtex/clients'

// TODO: Enhance order typings
export interface OrderItemDetailResponseExtended
  extends OrderItemDetailResponse {
  orderId: string
  skuName: string
  state: string
  changeData?: {
    changesData: ChangesData[]
  }
  totals: OrderTotalsItem[]
  creationDate: string
  clientProfileData: {
    email: string
  }
  items: OrderItem[]
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

type OrderTotalsItem = {
  id: string
  name: string
  value: number
}

type OrderItem = {
  id: string
  skuName: string
  imageUrl: string
  sellingPrice: number
  quantity: number
}
