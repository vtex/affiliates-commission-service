import type { ReadStream } from 'fs'

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
import { getHeaderRowFromStream, REQUIRED_HEADERS } from '../../utils/importing'

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
    { file }: MutationImportCommissionsBySkuArgs
  ) =>
    // { clients: { spreadsheetEventBroadcaster } }: Context
    {
      const formData = new FormData()
      const { createReadStream } = await file

      const stream: ReadStream = createReadStream()

      formData.append('file', stream)
      formData.append('appId', 'vtex.affiliates-commission-service')

      const fileHeaders = await getHeaderRowFromStream(stream)

      REQUIRED_HEADERS.forEach((header) => {
        if (!fileHeaders.includes(header)) {
          throw new Error(
            `The file must contain the following headers: ${REQUIRED_HEADERS.join(
              ', '
            )}`
          )
        }
      })

      // spreadsheetEventBroadcaster.notify(formData)

      return true
    },
}

export const fieldResolvers = {
  CommissionBySKU: {
    skuId: (parent: CommissionBySKU) => parent.id,
  },
}
