import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { method, Service } from '@vtex/api'

import { Clients } from './clients'
import { authenticateRequest } from './middlewares/authenticateRequest'
import { parseGetRequest } from './middlewares/commission/parseGetRequest'
import { getCommissionBySKU } from './middlewares/commission/getCommissionBySKU'
import { setCommissionBySKU } from './middlewares/commission/setCommissionBySKU'
import { deleteCommissionBySKU } from './middlewares/commission/deleteCommissionBySKU'
import { getAffiliateOrder } from './middlewares/getAffiliateOrder'
import { getAffiliateOrders } from './middlewares/getAffiliateOrders'
import { parseData } from './middlewares/parseData'
import { saveOrUpdateAffiliateOrder } from './middlewares/saveOrUpdateAffiliateOrder'
import { updateOrderStatus } from './middlewares/updateOrderStatus'
import { validateChangedItems } from './middlewares/validateChangedItems'
import { validateOrder } from './middlewares/validateOrder'
import type { CommissionServiceInputData } from './typings/commission'

const TIMEOUT_MS = 2 * 1000

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
  },
}

interface State extends RecorderState {
  commissionInput: CommissionServiceInputData
}

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State>
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    affiliateOrders: method({
      GET: [authenticateRequest, getAffiliateOrders],
    }),
    commissionBySKU: method({
      GET: [parseGetRequest, getCommissionBySKU],
      PUT: [setCommissionBySKU],
      DELETE: [deleteCommissionBySKU],
    }),
  },
  events: {
    setAffiliatesOrders: [validateOrder, parseData, saveOrUpdateAffiliateOrder],
    updateOrderStatus: [validateOrder, getAffiliateOrder, updateOrderStatus],
    updateInvoicedOrder: [
      validateOrder,
      getAffiliateOrder,
      validateChangedItems,
      saveOrUpdateAffiliateOrder,
    ],
  },
})
