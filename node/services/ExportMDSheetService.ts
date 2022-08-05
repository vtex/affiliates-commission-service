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

    page.forEach(({ id, affiliateId, orderTotalCommission, orderItems, status }) => {
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
          status,
        })
      })
    })

    return newPage
  }

  public getAllMDDocuments = async (sort?: string, where?: string) => {
    const { MDClient, fields, formatAffiliateOrders } = this
    const pageSize = PAGE_SIZE_FOR_EXPORTING
    let MD_TOKEN = ''

    let hasMoreData = true
    const responseData: unknown[][] = []

    while (hasMoreData) {
      // eslint-disable-next-line no-await-in-loop
      const { data, mdToken } = await MDClient.scroll({
        fields,
        size: pageSize,
        sort,
        where,
        mdToken: MD_TOKEN !== '' ? MD_TOKEN : undefined,
      })

      responseData.push(
        this.entity === 'affiliatesOrders'
          ? formatAffiliateOrders(data as AffiliatesOrders[])
          : data
      )
      // The first call is made without the token, then the first response gives us that token
      // We use that token to make the next calls
      MD_TOKEN = MD_TOKEN !== '' ? MD_TOKEN : mdToken

      if (data.length === 0) {
        hasMoreData = false
      }
    }

    const documents = responseData.flat()

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
