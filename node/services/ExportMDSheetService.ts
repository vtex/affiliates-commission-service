import { stream, utils } from 'xlsx'
import { v4 as uuid } from 'uuid'
import type { MasterDataEntity } from '@vtex/clients'
import type {
  AffiliatesOrders,
  CommissionBySKU,
} from 'vtex.affiliates-commission-service'

import type {
  AffiliateOrderExportingRow,
  MDEntityForExporting,
} from '../utils/exporting'
import {
  baseURLForExporting,
  bucketNameForExporting,
  fieldsForExporting,
  getAdminUserEmail,
  PAGE_SIZE_FOR_EXPORTING,
} from '../utils/exporting'
import { emailTemplateName } from '../utils/email'

export class ExportMDSheetService {
  private entity: MDEntityForExporting
  private ctx: Context
  private MDClient: MasterDataEntity<AffiliatesOrders | CommissionBySKU>
  private bucketName: string
  private fields: string[]
  private templateName: string
  private baseURL: string

  constructor(entity: MDEntityForExporting, ctx: Context) {
    this.entity = entity
    this.ctx = ctx
    this.MDClient =
      entity === 'affiliatesOrders'
        ? this.ctx.clients.affiliatesOrders
        : this.ctx.clients.commissionBySKU
    this.bucketName = bucketNameForExporting(entity)
    this.fields = fieldsForExporting(entity)
    this.templateName = emailTemplateName(entity)
    this.baseURL = baseURLForExporting(
      entity,
      this.ctx.vtex.account,
      this.ctx.vtex.workspace
    )
  }

  private formatAffiliateOrders = (page: AffiliatesOrders[]) => {
    const newPage: AffiliateOrderExportingRow[] = []

    page.forEach(({ id, affiliateId, orderTotalCommission, orderItems }) => {
      orderItems.forEach(({ skuId, skuName, price, quantity, commission }) => {
        newPage.push({
          id: `${id}`,
          affiliateId,
          orderTotalCommission: orderTotalCommission ?? 0,
          skuId,
          skuName,
          price,
          quantity,
          commission,
        })
      })
    })

    return newPage
  }

  public getAllMDDocuments = async (sort?: string, where?: string) => {
    const { MDClient, fields, formatAffiliateOrders } = this
    const pageSize = PAGE_SIZE_FOR_EXPORTING
    const {
      pagination: { total },
    } = await MDClient.searchRaw({ page: 1, pageSize: 1 }, fields, sort, where)

    const totalPages = Math.ceil(total / pageSize)

    const promises = []

    for (let page = 1; page <= totalPages; page++) {
      promises.push(
        MDClient.search({ page, pageSize }, fields, sort, where).then(
          (documentPage) =>
            this.entity === 'affiliatesOrders'
              ? formatAffiliateOrders(documentPage as AffiliatesOrders[])
              : documentPage
        )
      )
    }

    const promiseResults = await Promise.all(promises)

    const documents = promiseResults.flat()

    return documents
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public saveToVBase = async (documents: any[]) => {
    const {
      bucketName,
      ctx: {
        clients: { vbase },
      },
    } = this

    const fileId = uuid()

    const fileName = `${fileId}.csv`

    const worksheet = utils.json_to_sheet(documents)

    const file = stream.to_csv(worksheet)

    await vbase.saveFile(bucketName, fileName, file)

    return fileName
  }

  public sendFileViaEmail = async (fileName: string) => {
    const {
      templateName,
      baseURL,
      ctx: {
        vtex: { adminUserAuthToken },
        clients: { messageCenter },
      },
    } = this

    if (!adminUserAuthToken) throw new Error('Admin user auth token not found')

    const userEmail = getAdminUserEmail(adminUserAuthToken)

    await messageCenter.sendMail({
      templateName,
      jsonData: {
        email: `${userEmail}`,
        link: `${baseURL}/${fileName}`,
      },
    })
  }
}
