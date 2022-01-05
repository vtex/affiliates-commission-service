import { json } from 'co-body'

import { SUCCESS } from '../../utils/constants'
import { CommissionBySKUService } from '../../services/CommissionBySKUService'
import type { CommissionServiceInputData } from '../../typings/commission'

export async function deleteCommissionBySKU(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const {
    req,
    clients: { commissionBySKU: commissionClient },
    vtex: { logger },
  } = ctx

  try {
    const body: CommissionServiceInputData = await json(req)

    const commissionService = new CommissionBySKUService(commissionClient, body)

    const result = await commissionService.delete()

    ctx.status = SUCCESS
    ctx.message = JSON.stringify(result)
  } catch (err) {
    logger.error({
      metric: 'delete-commission-by-sku',
      message: err.message,
    })
    throw new Error('Error deleting commission by SKU')
  }

  await next()
}
