import { json } from 'co-body'

import { SUCCESS } from '../../utils/constants'
import { CommissionBySKUService } from '../../services/CommissionBySKUService'
import type { CommissionServiceInputData } from '../../typings/commission'

export async function setCommissionBySKU(
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

    const result = await commissionService.saveOrUpdate()

    ctx.status = SUCCESS
    ctx.message = JSON.stringify(result)
  } catch (err) {
    logger.error({
      metric: 'set-commission-by-sku',
      message: err.message,
    })
    throw new Error('Error setting commission by SKU:')
  }

  await next()
}
