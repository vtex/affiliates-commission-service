import type { EventContext } from '@vtex/api'

import type { Clients } from '../clients'

export async function saveOrUpdateAffiliateOrder(
  {
    state,
    clients: { affiliatesOrders },
    vtex: { logger },
  }: EventContext<Clients>,
  next: () => Promise<unknown>
) {
  const { affiliateOrder } = state

  try {
    await affiliatesOrders.saveOrUpdate(affiliateOrder)
  } catch (err) {
    logger.error({
      metric: 'save-or-update-affiliate-order',
      message: 'Error saving or updating the affiliate order',
      affiliateOrder,
      error: err.message,
    })
    throw new Error('Error saving or updating the affiliate order')
  }

  await next()
}
