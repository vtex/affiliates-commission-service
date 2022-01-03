import type { EventContext } from '@vtex/api'

import type { Clients } from '../clients'
import type { OrderItemDetailResponseExtended } from '../typings/order'
import { CUSTOM_DATA_FIELD_ID } from '../utils/constants'

// This middleware will parse the data to the object the MD expects
export async function parseData(
  { state, vtex: { logger } }: EventContext<Clients>,
  next: () => Promise<unknown>
) {
  const { order, customData } = state
  const affiliateId = customData.fields[CUSTOM_DATA_FIELD_ID]

  try {
    let orderTotalCommission = 0
    // For now, all items will have the sabe commission value because
    // we are working in parallel on different MD entities.
    // TODO: Change the commission value to get the right value per SKU
    const constantCommission = 5
    const orderItems = order.items.map(
      (item: OrderItemDetailResponseExtended) => {
        const { id, skuName, imageUrl, sellingPrice, quantity } = item

        orderTotalCommission +=
          (quantity * sellingPrice * constantCommission) / 100

        return {
          skuId: id,
          skuName,
          skuImageUrl: imageUrl,
          price: sellingPrice,
          quantity,
          commission: constantCommission,
        }
      }
    )

    const orderTotal = order.totals.find(
      (total: { id: string }) => total.id === 'Items'
    ).value

    const affiliateOrder = {
      id: order.orderId,
      affiliateId,
      status: order.state,
      userEmail: order.clientProfileData.email,
      orderDate: order.creationDate,
      orderItems,
      orderTotalCommission,
      orderTotal,
    }

    state.affiliateOrder = affiliateOrder
  } catch (err) {
    logger.error({
      metric: 'parse-data',
      message: 'Error parsing the order data',
      orderId: order.orderId,
      error: err.message,
    })
    throw new Error('Error parsing the order data')
  }

  await next()
}
