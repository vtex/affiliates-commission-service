import type { CommissionServiceInputData } from '../../typings/commission'
import {
  LOGGER_ERROR_MESSAGES,
  LOGGER_ERROR_METRICS,
} from '../../utils/constants'

export async function parseGetRequest(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const {
    query: { ids },
    vtex: { logger },
    state,
  } = ctx

  const parsedData: unknown[] = []

  try {
    typeof ids === 'string' &&
      ids.split(',').forEach((id) => {
        parsedData.push({ id })
      })

    state.commissionInput = parsedData as CommissionServiceInputData
  } catch (err) {
    logger.error({
      metric: LOGGER_ERROR_METRICS.parseGetCommissionRequest,
      message: err.message,
    })
    throw new Error(LOGGER_ERROR_MESSAGES.parseGetCommissionRequest)
  }

  await next()
}
