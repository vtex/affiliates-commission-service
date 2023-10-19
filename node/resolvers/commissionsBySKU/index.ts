import type {
  QueryCommissionsBySkuArgs,
  MutationExportCommissionsBySkuArgs,
  MutationUpdateCommissionArgs,
  MutationImportCommissionsBySkuArgs,
} from 'vtex.affiliates-commission-service'

import type { CommissionBySKU } from '../../typings/commission'
import { ExportMDSheetService } from '../../services/ExportMDSheetService'
import { parseCommissionsBySKUFilters } from '../../utils/filters'
import { ImportCommissionsService } from '../../services/ImportCommissionsService'

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
  lastImportedCommissionFileInfo: async (
    _: unknown,
    __: unknown,
    { clients: { vbase } }: Context
  ) => vbase.getJSON('last-import', 'info'),
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
    upload: MutationImportCommissionsBySkuArgs, // https://github.com/jaydenseric/graphql-upload#type-fileupload
    ctx: Context
  ) => {
    const file = await upload.file

    const {
      initializeBuffer,
      validateHeaderRow,
      saveToVBase,
      sendFileForProcessing,
    } = new ImportCommissionsService(file, ctx)

    await initializeBuffer()

    await validateHeaderRow()

    await saveToVBase()

    await sendFileForProcessing()

    return true
  },
}

export const fieldResolvers = {
  CommissionBySKU: {
    skuId: (parent: CommissionBySKU) => parent.id,
  },
}
