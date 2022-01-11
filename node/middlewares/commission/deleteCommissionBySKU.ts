import { json } from 'co-body'

import {
  LOGGER_ERROR_MESSAGES,
  LOGGER_ERROR_METRICS,
  SUCCESS,
} from '../../utils/constants'
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
      metric: LOGGER_ERROR_METRICS.deleteCommissionBySKU,
      message: err.message,
    })
    throw new Error(LOGGER_ERROR_MESSAGES.deleteCommissionBySKU)
  }

  await next()
}
