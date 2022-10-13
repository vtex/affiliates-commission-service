import type { EventContext } from '@vtex/api'
import type { CustomApps } from '@vtex/clients'

import type { Clients } from '../clients'
import { CommissionBySKUService } from '../services/CommissionBySKUService'
import type { OrderItemDetailResponseExtended } from '../typings/order'
import {
  CUSTOM_DATA_FIELD_ID,
  LOGGER_ERROR_MESSAGES,
  LOGGER_ERROR_METRICS,
} from '../utils/constants'
import { getDefaultCommission } from '../utils/functions'

// This middleware will parse the data to the object the MD expects
export async function parseData(
  {
    state,
    clients: { commissionBySKU, apps },
    vtex: { logger },
  }: EventContext<Clients>,
  next: () => Promise<unknown>
) {
  const {
    order,
    customData,
  }: { order: OrderItemDetailResponseExtended; customData: CustomApps } = state

  const affiliateId = customData.fields[CUSTOM_DATA_FIELD_ID]

  try {
    let orderTotalCommission = 0
    const itemsIds = order.items.map((item) => {
      return { id: item.id, commission: 0 }
    })

    const commissionService = new CommissionBySKUService(
      commissionBySKU,
      itemsIds
    )

    const commissions = await commissionService.get()
    const defaultCommission = await getDefaultCommission(apps)

    const orderItems = order.items.map((item) => {
      const { id, name, imageUrl, sellingPrice, quantity } = item
      const skuCommission = commissions.data.find((sku) => sku.id === id)
      const commissionValue = skuCommission
        ? (skuCommission.commission as number)
        : defaultCommission

      orderTotalCommission += (quantity * sellingPrice * commissionValue) / 100

      return {
        skuId: id,
        name,
        skuImageUrl: imageUrl,
        price: sellingPrice,
        quantity,
        commission: commissionValue,
      }
    })

    const totalItems =
      order.totals.find((total) => total.id === 'Items')?.value ?? 0

    const totalDiscount =
      order.totals.find((total) => total.id === 'Discounts')?.value ?? 0

    const orderTotals = totalItems + totalDiscount

    const affiliateOrder = {
      id: order.orderId,
      affiliateId,
      status: order.state,
      userEmail: order.clientProfileData.email,
      orderDate: order.creationDate,
      orderItems,
      orderTotalCommission,
      orderTotal: orderTotals,
    }

    state.affiliateOrder = affiliateOrder
  } catch (err) {
    logger.error({
      metric: LOGGER_ERROR_METRICS.parseData,
      message: LOGGER_ERROR_MESSAGES.parseData,
      orderId: order.orderId,
      error: err.message,
    })
    throw new Error(LOGGER_ERROR_MESSAGES.parseData)
  }

  await next()
}
