import { SUCCESS } from '../../utils/constants'
import { CommissionBySKUService } from '../../services/CommissionBySKUService'

export async function getCommissionBySKU(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const {
    state: { commissionInput },
    clients: { commissionBySKU: commissionClient },
    vtex: { logger },
  } = ctx

  try {
    const commissionService = new CommissionBySKUService(
      commissionClient,
      commissionInput
    )

    const result = await commissionService.get()

    ctx.status = SUCCESS
    ctx.message = JSON.stringify(result)
  } catch (err) {
    logger.error({
      metric: 'get-commission-by-sku',
      message: err.message,
    })
    throw new Error('Error getting commission by SKU:')
  }

  await next()
}
