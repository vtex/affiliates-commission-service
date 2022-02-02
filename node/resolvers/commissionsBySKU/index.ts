import type {
  CommissionBySKU,
  QueryCommissionsBySkuArgs,
  MutationExportCommissionsBySkuArgs,
  MutationUpdateCommissionArgs,
} from 'vtex.affiliates-commission-service'

import { ExportMDSheetService } from '../../services/ExportMDSheetService'
import { parseCommissionsBySKUFilters } from '../../utils/filters'

export const queries = {
  commissionsBySKU: async (
    _: unknown,
    { page, pageSize, filter, sorting }: QueryCommissionsBySkuArgs,
    { clients: { commissionBySKU } }: Context
  ) => {
    const pagination = { page, pageSize }
    const fields = ['_all']
    const sort = sorting ? `${sorting.field} ${sorting.order}` : undefined
    const where = filter ? parseCommissionsBySKUFilters(filter) : undefined

    return commissionBySKU.searchRaw(pagination, fields, sort, where)
  },
}

export const mutations = {
  updateCommission: async (
    _: unknown,
    { newCommission: { id, commission } }: MutationUpdateCommissionArgs,
    { clients: { commissionBySKU } }: Context
  ) => {
    const fields = ['_all']

    await commissionBySKU.update(id, { commission })

    return commissionBySKU.get(id, fields)
  },
  exportCommissionsBySKU: async (
    _: unknown,
    { filter, sorting }: MutationExportCommissionsBySkuArgs,
    ctx: Context
  ) => {
    const { getAllMDDocuments, saveToVBase, sendFileViaEmail } =
      new ExportMDSheetService('commissionBySKU', ctx)

    const sort = sorting ? `${sorting.field} ${sorting.order}` : undefined
    const where = filter ? parseCommissionsBySKUFilters(filter) : undefined

    const documents = await getAllMDDocuments(sort, where)

    const fileName = await saveToVBase(documents)

    await sendFileViaEmail(fileName)

    return true
  },
}

export const fieldResolvers = {
  CommissionBySKU: {
    skuId: (parent: CommissionBySKU) => parent.id,
  },
}
