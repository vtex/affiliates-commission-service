import type { EventContext } from '@vtex/api'

import type { Clients } from '../clients'
import {
  ALL_MD_FIELDS,
  LOGGER_ERROR_MESSAGES,
  LOGGER_ERROR_METRICS,
} from '../utils/constants'

export async function getAffiliateOrder(
  {
    state,
    clients: { affiliatesOrders },
    vtex: { logger },
  }: EventContext<Clients> | Context,
  next: () => Promise<unknown>
) {
  const { order } = state
  const { orderId } = order

  try {
    const affiliateOrder = await affiliatesOrders.get(orderId, ALL_MD_FIELDS)

    state.affiliateOrder = affiliateOrder
  } catch (err) {
    logger.error({
      metric: LOGGER_ERROR_METRICS.getAffiliateOrder,
      message: LOGGER_ERROR_MESSAGES.getAffiliateOrder,
      orderId,
      error: err.message,
    })
    throw new Error(LOGGER_ERROR_MESSAGES.getAffiliateOrder)
  }

  await next()
}
