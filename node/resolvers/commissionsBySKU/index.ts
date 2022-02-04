import FormData from 'form-data'
import type {
  CommissionBySKU,
  QueryCommissionsBySkuArgs,
  MutationExportCommissionsBySkuArgs,
  MutationUpdateCommissionArgs,
  MutationImportCommissionsBySkuArgs,
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

    getAllMDDocuments(sort, where)
      .then((documents) => saveToVBase(documents))
      .then((fileName) => sendFileViaEmail(fileName))

    return true
  },
  importCommissionsBySKU: async (
    _: unknown,
    { file }: MutationImportCommissionsBySkuArgs,
    { clients: { spreadsheetEventBroadcaster } }: Context
  ) => {
    const formData = new FormData()

    try {
      formData.append('file', file.createReadStream())
      formData.append('fileName', file.filename)
      formData.append('fileType', 'csv')
      formData.append('appId', 'vtex.affiliates-commission-service')
      spreadsheetEventBroadcaster.send(formData)
    } catch (error) {
      console.error(error)
    }

    return true
  },
}

export const fieldResolvers = {
  CommissionBySKU: {
    skuId: (parent: CommissionBySKU) => parent.id,
  },
}
