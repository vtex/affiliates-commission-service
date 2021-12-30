import type { OrderItemDetailResponse } from '@vtex/clients'

export interface OrderItemDetailResponseExtended
  extends OrderItemDetailResponse {
  skuName: string
}
