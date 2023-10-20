import type { MasterDataEntity, WithMetadata } from '@vtex/clients'

export interface CommissionBySKU {
  commission: number
  refId?: string
  [k: string]: unknown
}

export type CommissionClient = MasterDataEntity<CommissionBySKU>

export type CommissionServiceInputData = Array<CommissionBySKU & { id: string }>

export type CommissionServiceOutputData = Array<
  Pick<WithMetadata<CommissionBySKU>, string | number>
>

export type CommissionServiceErrors = Array<{
  id: string
  message: string
}>

export interface AffiliatesOrders {
  affiliateId: string
  status?: string
  userEmail: string
  orderTotal?: number
  orderTotalCommission?: number
  orderDate?: string
  orderItems: Array<{
    skuId: string
    skuName: string
    skuImageUrl?: string
    price: number
    quantity: number
    commission: number
    [k: string]: unknown
  }>
  [k: string]: unknown
}
