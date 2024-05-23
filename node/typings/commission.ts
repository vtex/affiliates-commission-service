import type { CommissionBySKU } from 'vtex.affiliates-commission-service'

export type CommissionClient = any

export type CommissionServiceInputData = Array<CommissionBySKU & { id: string }>

export type CommissionServiceOutputData = Array<Pick<any, string | number>>

export type CommissionServiceErrors = Array<{
  id: string
  message: string
}>
