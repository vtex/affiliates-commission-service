import type { EventContext } from '@vtex/api'

import type { Clients } from '../clients'
import { LOGGER_ERROR_MESSAGES, LOGGER_ERROR_METRICS } from '../utils/constants'

export async function updateOrderStatus(
  {
    state,
    clients: { affiliatesOrders },
    vtex: { logger },
  }: EventContext<Clients>,
  next: () => Promise<unknown>
) {
  const {
    order: { orderId, state: status },
    affiliateOrder,
  } = state

  try {
    await affiliatesOrders.update(orderId, {
      ...affiliateOrder,
      status,
    })
  } catch (err) {
    logger.error({
      metric: LOGGER_ERROR_METRICS.updateOrderStatus,
      message: LOGGER_ERROR_MESSAGES.updateOrderStatus,
      orderId,
      error: err.message,
    })
    throw new Error(LOGGER_ERROR_MESSAGES.updateOrderStatus)
  }

  await next()
}
