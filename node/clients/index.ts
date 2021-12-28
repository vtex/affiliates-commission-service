import { IOClients } from '@vtex/api'
import { masterDataFor } from '@vtex/clients'
import type { AffiliatesOrders } from 'vtex.affiliates-commission-service'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get affiliatesOrders() {
    return this.getOrSet(
      'affiliatesOrders',
      masterDataFor<AffiliatesOrders>('affiliatesOrders')
    )
  }
}
