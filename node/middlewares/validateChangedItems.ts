import type { EventContext } from '@vtex/api'
import type { AffiliatesOrders } from 'vtex.affiliates-commission-service'

import type { Clients } from '../clients'
import type {
  ChangesData,
  ChangesItem,
  OrderItemDetailResponseExtended,
} from '../typings/order'
import {
  INVOICED_STATUS,
  LOGGER_ERROR_MESSAGES,
  LOGGER_ERROR_METRICS,
} from '../utils/constants'

// This middleware will parse the data to the object the MD expects
// It will see the changes made to the order after it is already created
export async function validateChangedItems(
  { state, clients: { catalog }, vtex: { logger } }: EventContext<Clients>,
  next: () => Promise<unknown>
) {
  const {
    order,
    affiliateOrder,
  }: {
    order: OrderItemDetailResponseExtended
    affiliateOrder: AffiliatesOrders
  } = state

  // If the affiliateOrder is already saved as invoiced we just return
  // We do this to avoid duplicated events
  if (affiliateOrder.status === INVOICED_STATUS) {
    return
  }

  const { changeData } = order

  affiliateOrder.status = order.state

  if (changeData) {
    const { changesData } = changeData

    const newItems: ChangesItem[] = []

    try {
      changesData.forEach((changedData: ChangesData) => {
        const { itemsAdded, itemsRemoved } = changedData

        // We want to look only changes that have items added or removed
        if (itemsAdded.length === 0 && itemsRemoved.length === 0) {
          return
        }

        // First we update the orderItems additions
        itemsAdded.forEach((item) => {
          const orderSkuIndex = affiliateOrder.orderItems.findIndex(
            (orderItem) => orderItem.skuId === item.id
          )

          // Here we can have two situations: A new item was added to the order or the quantity was changed
          // If a new item was added we add the call to that item to an array that will be used later
          if (orderSkuIndex === -1) {
            newItems.push(item)
          } else {
            const orderItem = affiliateOrder.orderItems[orderSkuIndex]

            // Now we check if the price sent for the new product is different from the one already in the order
            // If the price is different we update the orderItems array adding the same SKU but with a new price
            if (orderItem.price !== item.price) {
              affiliateOrder.orderItems.push({
                ...orderItem,
                price: item.price,
                quantity: item.quantity,
              })
            } else {
              // If the item price is the same we just update the quantity
              orderItem.quantity =
                (orderItem.quantity as number) + item.quantity
            }
          }
        })

        // Then we update the orderItems removals
        itemsRemoved.forEach((item) => {
          const orderSkuIndex = affiliateOrder.orderItems.findIndex(
            (orderItem) => orderItem.skuId === item.id
          )

          if (orderSkuIndex !== -1) {
            const orderItem = affiliateOrder.orderItems[orderSkuIndex]

            orderItem.quantity = (orderItem.quantity as number) - item.quantity
          }
        })
      })

      // Then we filter the orderItems array to remove the items with quantity 0
      affiliateOrder.orderItems = affiliateOrder.orderItems.filter(
        (item) => item.quantity > 0
      )

      // Create an array of promises to get the sku info
      const skuInfoPromises = newItems.map((item) => {
        return catalog.getSkuContext(item.id)
      })

      // TODO: GET COMMISSION BY SKU
      const tempCommission = 5

      // We resolve the promises and add the new item to the orderItems array
      await Promise.all(skuInfoPromises).then((skuInfoArray) => {
        skuInfoArray.forEach((skuInfo) => {
          const item = newItems.find(
            (newItem) => parseInt(newItem.id, 10) === skuInfo.Id
          ) as ChangesItem

          affiliateOrder.orderItems.push({
            skuId: item.id,
            skuName: skuInfo.SkuName,
            skuImageUrl: skuInfo.ImageUrl as string,
            price: item.price,
            quantity: item.quantity,
            commission: tempCommission,
          })
        })
      })

      // Lastly we update the orderTotalCommission and orderTotal
      let newTotalCommission = 0
      let newOrderTotal = 0

      affiliateOrder.orderItems.forEach((item) => {
        const { commission, price, quantity } = item

        newOrderTotal += price * quantity
        newTotalCommission += (quantity * price * commission) / 100
      })

      affiliateOrder.orderTotalCommission = newTotalCommission
      affiliateOrder.orderTotal = newOrderTotal
    } catch (err) {
      logger.error({
        metric: LOGGER_ERROR_METRICS.validateChangedItems,
        message: LOGGER_ERROR_MESSAGES.validateChangedItems,
        orderId: order.id,
        error: err.message,
      })
      throw new Error(LOGGER_ERROR_MESSAGES.validateChangedItems)
    }
  }

  state.affiliateOrder = affiliateOrder
  await next()
}
