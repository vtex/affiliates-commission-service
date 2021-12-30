import { IOClients } from '@vtex/api'
import { masterDataFor } from '@vtex/clients'
import type { AffiliatesOrders } from 'vtex.affiliates-commission-service'

import CheckoutExtended from './checkout'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get affiliatesOrders() {
    return this.getOrSet(
      'affiliatesOrders',
      masterDataFor<AffiliatesOrders>('affiliatesOrders')
    )
  }

  public get checkout() {
    return this.getOrSet('checkout', CheckoutExtended)
  }
}
