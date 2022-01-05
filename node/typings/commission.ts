import type { MasterDataEntity, WithMetadata } from '@vtex/clients'
import type { CommissionBySKU } from 'vtex.affiliates-commission-service'

export type CommissionClient = MasterDataEntity<CommissionBySKU>

export type CommissionServiceInputData = Array<CommissionBySKU & { id: string }>

export type CommissionServiceOutputData = Array<
  Pick<WithMetadata<CommissionBySKU>, string | number>
>

export type CommissionServiceErrors = Array<{
  id: string
  message: string
}>
