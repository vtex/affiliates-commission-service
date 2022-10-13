import type { EventContext } from '@vtex/api'
import type { App } from '@vtex/clients'

import type { Clients } from '../clients'
import { CUSTOM_DATA_APP_ID } from '../utils/constants'

// This middleware will validade if the order has a customData affiliateId
export async function validateOrder(
  {
    body,
    clients: { checkout },
    state,
    vtex: { logger },
  }: EventContext<Clients>,
  next: () => Promise<unknown>
) {
  const { orderId } = body

  try {
    const order = await checkout.order(orderId)
    const { customData } = order

    const affiliateApp = customData?.customApps?.find(
      (app: App) => app.id === CUSTOM_DATA_APP_ID
    )

    if (affiliateApp) {
      state.order = order
      state.customData = affiliateApp
    } else {
      return
    }
  } catch (err) {
    logger.error({
      metric: 'validate-order',
      message: 'Error validating the order',
      orderId,
      error: err.message,
    })
    throw new Error('Error validating the order')
  }

  await next()
}
